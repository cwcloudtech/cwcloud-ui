import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import classes from './PodLogs.module.css';
import LocalStorageService from '../../../../../../../utils/localStorageService';
const PodLogs = ({ 
  maxLogLines = 500,
  autoReconnect = true,
  reconnectInterval = 3000 
}) => {
  const { podName, namespace } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const podInfo = location.state?.pod || {
    name: podName,
    namespace: namespace,
    status: 'Unknown',
    node: 'Unknown',
    createdAt: 'Unknown',
    clusterId: 'Unknown'
  };

  const [logLines, setLogLines] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const getWebSocketUrl = useCallback(() => {
    const apiUrl = process.env.REACT_APP_APIURL;
    if (!apiUrl) return null;
    return apiUrl.replace(/^https?:\/\//, (match) => {
      return match === 'https://' ? 'wss://' : 'ws://';
    });
  }, []);

  const parseLogMessage = useCallback((message) => {
    const timestamp = new Date().toISOString();
    try {
      const parsed = JSON.parse(message);
      return {
        text: parsed.message || parsed.msg || message,
        type: parsed.level?.toLowerCase() || parsed.severity?.toLowerCase() || 'info',
        timestamp: parsed.timestamp || timestamp,
        source: parsed.source || parsed.component || 'pod',
        container: parsed.container || 'main'
      };
    } catch {
      let type = 'info';
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('[error]') || lowerMessage.includes('error:') || lowerMessage.includes('failed')) {
        type = 'error';
      } else if (lowerMessage.includes('[warn]') || lowerMessage.includes('warning:') || lowerMessage.includes('warn:')) {
        type = 'warning';
      } else if (lowerMessage.includes('[info]') || lowerMessage.includes('success')) {
        type = 'success';
      }
      return { text: message, type, timestamp, source: 'pod', container: 'main' };
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    if (!podName || !namespace) {
      setError('Missing pod name or namespace');
      setConnectionStatus('error');
      return;
    }
    const token = LocalStorageService.getAccessToken();
    if (!token) {
      setError('No access_token found. Please sign in again.');
      setConnectionStatus('error');
      return;
    }

    const wsBase = getWebSocketUrl();
    if (!wsBase) {
      setError('API URL not configured');
      setConnectionStatus('error');
      return;
    }

    setConnectionStatus('connecting');
    setError(null);

    try {
      const clusterId = podInfo.cluster_id;
      const wsUrl = new URL(`${wsBase}/v1/admin/kubernetes/object/cluster/${clusterId}/pods/${podName}/logs/ws`);
      wsUrl.searchParams.set('namespace', namespace);
      wsUrl.searchParams.set('container_name', podInfo.container || '');
      wsUrl.searchParams.set('tail_lines', '100');

      const ws = new WebSocket(wsUrl.toString(),['bearer', token]);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        setIsStreaming(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const logData = parseLogMessage(event.data);
          setLogLines(prev => {
            const next = [...prev, logData];
            return next.length > maxLogLines ? next.slice(-maxLogLines) : next;
          });
        } catch (err) {
          console.error('Error parsing log message:', err);
        }
      };

      ws.onerror = () => {
        setError(`Connection error for ${namespace}/${podName}`);
        setConnectionStatus('error');
      };

      ws.onclose = (event) => {
        setConnectionStatus('disconnected');
        setIsStreaming(false);

        if (event.code !== 1000 && autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);
          setError(`Connection lost. Reconnecting in ${Math.round(delay / 1000)}s... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Maximum reconnection attempts reached. Please refresh the page.');
        }
      };
    } catch {
      setError(`Failed to establish connection to ${namespace}/${podName}`);
      setConnectionStatus('error');
    }
  }, [getWebSocketUrl, podName, namespace, autoReconnect, reconnectInterval, parseLogMessage, podInfo.container, podInfo.cluster_id, maxLogLines]);

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setConnectionStatus('disconnected');
    setIsStreaming(false);
    setLogLines([]);
  }, []);

  const handleReconnect = useCallback(() => {
    disconnectWebSocket();
    reconnectAttemptsRef.current = 0;
    setTimeout(connectWebSocket, 500);
  }, [connectWebSocket, disconnectWebSocket]);

  const handleClearLogs = useCallback(() => setLogLines([]), []);

  const handleExportLogs = useCallback(() => {
    if (logLines.length === 0) {
      alert('No logs to export.');
      return;
    }
    const formatted = logLines.map(log => {
      const time = formatTimestamp(log.timestamp);
      const container = log.container && log.container !== 'main' ? `[${log.container}] ` : '';
      return `[${time}] ${log.type.toUpperCase()} ${container}${log.text}`;
    }).join('\n');

    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${namespace}-${podName}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [logLines, podName, namespace]);

  const handleGoBack = useCallback(() => {
    disconnectWebSocket();
    navigate(-1);
  }, [navigate, disconnectWebSocket]);

  useEffect(() => {
    if (podName && namespace) connectWebSocket();
    return () => disconnectWebSocket();
  }, [podName, namespace, connectWebSocket, disconnectWebSocket]);

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connecting': return { text: 'Connecting...', className: 'connecting' };
      case 'connected':  return { text: isStreaming ? 'Streaming' : 'Connected', className: 'connected' };
      case 'error':      return { text: 'Error', className: 'error' };
      default:           return { text: 'Disconnected', className: 'disconnected' };
    }
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3
    });
  };
  const getPodStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'running': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed':
      case 'error':   return '#ef4444';
      case 'succeeded': return '#6366f1';
      default: return '#6b7280';
    }
  };
  if (!podName || !namespace) {
    return (
      <div className={classes.container}>
        <div className={classes.errorContainer}>
          <h2>Invalid Pod Reference</h2>
          <p>Missing pod name or namespace in URL parameters.</p>
          <button className={`${classes.iconButton} ${classes.primaryButton}`} onClick={() => navigate('/kubernetes')}>
            Back to Kubernetes Dashboard
          </button>
        </div>
      </div>
    );
  }
  const statusInfo = getStatusInfo();
  return (
    <div className={classes.container}>
      <div className={classes.terminalWrapper}>
        <div className={classes.window}>
          <div className={classes.titleBar}>
            <div className={classes.titleText}>
              kubectl logs {podName} -n {namespace} --follow
            </div>
            <div className={classes.statusIndicator}>
              <div className={`${classes.statusDot} ${classes[statusInfo.className]}`}></div>
              <span className={classes.statusText}>{statusInfo.text}</span>
            </div>
          </div>

          <div className={classes.podInfoHeader}>
            <div className={classes.podDetails}>
              <div className={classes.podName}>
                <span className={classes.podLabel}>Pod:</span>
                <span className={classes.podValue}>{podName}</span>
              </div>
              <div className={classes.podNamespace}>
                <span className={classes.podLabel}>Namespace:</span>
                <span className={classes.podValue}>{namespace}</span>
              </div>
              <div className={classes.podStatus}>
                <span className={classes.podLabel}>Status:</span>
                <span className={classes.podStatusValue} style={{ color: getPodStatusColor(podInfo.status) }}>
                  {podInfo.status || 'Unknown'}
                </span>
              </div>
              {podInfo.node && (
                <div className={classes.podNode}>
                  <span className={classes.podLabel}>Node:</span>
                  <span className={classes.podValue}>{podInfo.node}</span>
                </div>
              )}
            </div>

            <div className={classes.actionButtons}>
              <button
                className={`${classes.iconButton} ${classes.secondaryButton}`}
                onClick={handleGoBack}
                title="Back to Pods"
                aria-label="Back"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 11H7.83l3.58-3.59L10 6l-6 6 6 6 1.41-1.41L7.83 13H19z"/>
                </svg>
              </button>

              <button
                className={`${classes.iconButton} ${classes.dangerButton}`}
                onClick={handleClearLogs}
                disabled={logLines.length === 0}
                title="Clear Logs"
                aria-label="Clear logs"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>

              <button
                className={`${classes.iconButton} ${connectionStatus === 'connected' ? classes.warningButton : classes.primaryButton}`}
                onClick={connectionStatus === 'connected' ? disconnectWebSocket : handleReconnect}
                title={connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}
                aria-label={connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}
              >
                {connectionStatus === 'connected' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6 6h12v12H6z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button
                className={`${classes.iconButton} ${classes.infoButton}`}
                onClick={handleExportLogs}
                title="Export Logs"
                aria-label="Export logs"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className={classes.terminal}>
            {error && (
              <div className={classes.errorBar}>
                <span className={classes.errorText}>Error: {error}</span>
                <button
                  className={`${classes.iconButton} ${classes.primaryButton} ${classes.smallButton}`}
                  onClick={handleReconnect}
                  aria-label="Reconnect"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4 7.58 4 4.01 7.58 4.01 12S7.58 20 12 20c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                  </svg>
                </button>
              </div>
            )}

            <div className={classes.terminalContent}>
              {logLines.length === 0 && connectionStatus === 'connected' ? (
                <div className={classes.emptyState}>
                  <p>Waiting for logs from {podName} in namespace {namespace}...</p>
                </div>
              ) : logLines.length === 0 && connectionStatus !== 'connected' ? (
                <div className={classes.emptyState}>
                  <p>Not connected to {podName}</p>
                  <button
                    className={`${classes.iconButton} ${classes.primaryButton}`}
                    onClick={handleReconnect}
                    style={{ marginTop: '10px' }}
                    aria-label="Connect"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              ) : (
                logLines.map((log, index) => (
                  <div key={`${log.timestamp}-${index}`} className={`${classes.logLine} ${classes[log.type]} ${classes.fadeIn}`}>
                    <span className={classes.timestamp}>{formatTimestamp(log.timestamp)}</span>
                    {log.container && log.container !== 'main' && (
                      <span className={classes.containerName}>[{log.container}]</span>
                    )}
                    <span className={classes.logText}>{log.text}</span>
                  </div>
                ))
              )}
              {isStreaming && (
                <div className={`${classes.logLine} ${classes.cursor}`}>
                  <span className={classes.timestamp}>{formatTimestamp(new Date())}</span>
                  <span className={classes.blinkingCursor}>|</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PodLogs;
