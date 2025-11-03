import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import classes from "../PodLogs/PodLogs.module.css"; 

const PodTerminal = ({
  websocketUrl = process.env.REACT_APP_WS_API_URL,
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
    createdAt: 'Unknown'
  };

  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [currentLine, setCurrentLine] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [prompt, setPrompt] = useState('$ ');

  const wsRef = useRef(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const keyMappings = {
    'ArrowUp': () => navigateHistory(-1),
    'ArrowDown': () => navigateHistory(1),
    'ArrowLeft': () => moveCursor(-1),
    'ArrowRight': () => moveCursor(1),
    'Home': () => setCursorPosition(0),
    'End': () => setCursorPosition(currentLine.length),
    'Backspace': () => handleBackspace(),
    'Delete': () => handleDelete(),
    'Tab': () => handleTab(),
    'Enter': () => handleEnter(),
  };

const navigateHistory = useCallback((direction) => {
  if (commandHistory.length === 0) return;

  const newIndex = Math.max(0, Math.min(commandHistory.length, historyIndex - direction));
  setHistoryIndex(newIndex);

  if (newIndex === commandHistory.length) {
    setCurrentLine('');
    setCursorPosition(0);
  } else {
    const command = commandHistory[commandHistory.length - 1 - newIndex];
    setCurrentLine(command);
    setCursorPosition(command.length);
  }
}, [commandHistory, historyIndex]);

  const moveCursor = useCallback((direction) => {
    setCursorPosition(prev => 
      Math.max(0, Math.min(currentLine.length, prev + direction))
    );
  }, [currentLine.length]);

  const handleBackspace = useCallback(() => {
    if (cursorPosition > 0) {
      const newLine = currentLine.slice(0, cursorPosition - 1) + currentLine.slice(cursorPosition);
      setCurrentLine(newLine);
      setCursorPosition(prev => prev - 1);
    }
  }, [currentLine, cursorPosition]);

  const handleDelete = useCallback(() => {
    if (cursorPosition < currentLine.length) {
      const newLine = currentLine.slice(0, cursorPosition) + currentLine.slice(cursorPosition + 1);
      setCurrentLine(newLine);
    }
  }, [currentLine, cursorPosition]);

  const handleTab = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'tab_completion',
        line: currentLine,
        cursor: cursorPosition
      }));
    }
  }, [currentLine, cursorPosition]);

  const handleEnter = useCallback(() => {
    if (!currentLine.trim()) {
      appendToOutput(`${prompt}\n`);
      return;
    }

    setCommandHistory(prev => [...prev, currentLine]);
    setHistoryIndex(-1);

    appendToOutput(`${prompt}${currentLine}\n`);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'command',
        data: currentLine
      }));
    }

    setCurrentLine('');
    setCursorPosition(0);
  }, [currentLine, prompt]);

  const appendToOutput = useCallback((text) => {
    setTerminalOutput(prev => prev + text);
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (keyMappings[e.key]) {
      e.preventDefault();
      keyMappings[e.key]();
      return;
    }

    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'interrupt',
              signal: 'SIGINT'
            }));
          }
          appendToOutput('^C\n');
          setCurrentLine('');
          setCursorPosition(0);
          break;
        case 'd':
          e.preventDefault();
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'eof'
            }));
          }
          break;
        case 'l':
          e.preventDefault();
          handleClearTerminal();
          break;
        case 'v':
          break;
        default:
          e.preventDefault();
      }
      return;
    }

    if (e.key.length === 1 && !e.altKey && !e.metaKey) {
      e.preventDefault();
      const newLine = currentLine.slice(0, cursorPosition) + e.key + currentLine.slice(cursorPosition);
      setCurrentLine(newLine);
      setCursorPosition(prev => prev + 1);
    }
  }, [currentLine, cursorPosition, keyMappings, appendToOutput]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    const newLine = currentLine.slice(0, cursorPosition) + pastedText + currentLine.slice(cursorPosition);
    setCurrentLine(newLine);
    setCursorPosition(prev => prev + pastedText.length);
  }, [currentLine, cursorPosition]);
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    if (!podName || !namespace) {
      setError('Missing pod name or namespace');
      setConnectionStatus('error');
      return;
    }
    setConnectionStatus('connecting');
    setError(null);
    try {
      const clusterId = podInfo.cluster_id || 1; // Default to cluster 1 if not specified
      const wsUrl = `${websocketUrl}/v1/admin/kubernetes/object/cluster/${clusterId}/pods/${podName}/terminal/ws?namespace=${namespace}${podInfo.container ? `&container_name=${podInfo.container}` : ''}`;
      console.log('Connecting to Terminal WebSocket:', wsUrl);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access_token found. Please sign in again.');
        setConnectionStatus('error');
        return;
      }
      const ws = new WebSocket(wsUrl, ['bearer', token]);
      wsRef.current = ws;
      ws.onopen = () => {
        console.log(`Terminal WebSocket connected for pod: ${namespace}/${podName}`);
        setConnectionStatus('connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          switch (message.type) {
            case 'output':
              appendToOutput(message.data);
              break;
            case 'prompt':
              setPrompt(message.data || '$ ');
              break;
            case 'completion':
              if (message.completions && message.completions.length > 0) {
                const completion = message.completions[0];
                const newLine = currentLine.slice(0, cursorPosition) + completion + currentLine.slice(cursorPosition);
                setCurrentLine(newLine);
                setCursorPosition(cursorPosition + completion.length);
              }
              break;
            case 'error':
              appendToOutput(`Error: ${message.message}\n`);
              break;
            default:
              appendToOutput(message.data || event.data);
          }
        } catch (err) {
          appendToOutput(event.data);
        }
      };
      ws.onerror = (error) => {
        console.error('Terminal WebSocket error:', error);
        setError(`Terminal connection error for ${namespace}/${podName}`);
        setConnectionStatus('error');
      };

      ws.onclose = (event) => {
        console.log('Terminal WebSocket closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
        setIsConnected(false);
        
        if (event.code !== 1000 && autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);
          
          setError(`Terminal connection lost. Reconnecting in ${delay/1000}s... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Maximum reconnection attempts reached. Please refresh the page.');
        }
      };

    } catch (err) {
      console.error('Failed to create terminal WebSocket connection:', err);
      setError(`Failed to establish terminal connection to ${namespace}/${podName}`);
      setConnectionStatus('error');
    }
  }, [websocketUrl, podName, namespace, autoReconnect, reconnectInterval, appendToOutput, podInfo.container]);

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
    setIsConnected(false);
  }, []);

  const handleClearTerminal = useCallback(() => {
    setTerminalOutput('');
    setCurrentLine('');
    setCursorPosition(0);
  }, []);

  const handleReconnect = useCallback(() => {
    disconnectWebSocket();
    reconnectAttemptsRef.current = 0;
    setTimeout(connectWebSocket, 500);
  }, [connectWebSocket, disconnectWebSocket]);

  const handleGoBack = useCallback(() => {
    disconnectWebSocket();
    navigate(-1);
  }, [navigate, disconnectWebSocket]);

  useEffect(() => {
    if (podName && namespace) {
      connectWebSocket();
    }
    
    return () => {
      disconnectWebSocket();
    };
  }, [podName, namespace, connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current && isConnected) {
        inputRef.current.focus();
      }
    };

    const handleWindowFocus = () => {
      if (inputRef.current && isConnected) {
        inputRef.current.focus();
      }
    };

    if (isConnected && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }

    document.addEventListener('click', handleClick);
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isConnected]);

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connecting':
        return { text: 'Connecting...', className: 'connecting' };
      case 'connected':
        return { text: 'Terminal Ready', className: 'connected' };
      case 'error':
        return { text: 'Error', className: 'error' };
      default:
        return { text: 'Disconnected', className: 'disconnected' };
    }
  };

  const getPodStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'running': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': 
      case 'error': return '#ef4444';
      case 'succeeded': return '#6366f1';
      default: return '#6b7280';
    }
  };

  if (!podName || !namespace) {
    return (
      <div className={classes.container}>
        <div className={classes.errorContainer}>
          <h2>❌ Invalid Pod Reference</h2>
          <p>Missing pod name or namespace in URL parameters.</p>
          <button 
            className={`${classes.iconButton} ${classes.primaryButton}`}
            onClick={() => navigate('/kubernetes')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
            </svg>
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
            <div className={classes.windowControls}>
              <div className={`${classes.windowButton} ${classes.close}`} onClick={handleGoBack}></div>
              <div className={`${classes.windowButton} ${classes.minimize}`}></div>
              <div className={`${classes.windowButton} ${classes.maximize}`}></div>
            </div>
            <div className={classes.titleText}>
              <span className={classes.podIcon}>💻</span>
              kubectl exec -it {podName} -n {namespace} -- /bin/sh
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
                <span 
                  className={classes.podStatusValue} 
                  style={{ color: getPodStatusColor(podInfo.status) }}
                >
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
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
                </svg>
              </button>
              
              <button 
                className={`${classes.iconButton} ${classes.dangerButton}`}
                onClick={handleClearTerminal}
                title="Clear Terminal (Ctrl+L)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
              
              <button 
                className={`${classes.iconButton} ${connectionStatus === 'connected' ? classes.warningButton : classes.primaryButton}`}
                onClick={connectionStatus === 'connected' ? disconnectWebSocket : handleReconnect}
                title={connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}
              >
                {connectionStatus === 'connected' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h2v12H6zm10 0h2v12h-2z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className={classes.terminal}>
            {error && (
              <div className={classes.errorBar}>
                <span className={classes.errorText}>⚠️ {error}</span>
                <button 
                  className={`${classes.iconButton} ${classes.primaryButton} ${classes.smallButton}`}
                  onClick={handleReconnect}
                >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                </svg>
                </button>
              </div>
            )}

            <div 
              ref={terminalRef}
              className={classes.terminalContent}
              style={{ 
                fontFamily: 'JetBrains Mono, monospace',
                whiteSpace: 'pre-wrap',
                userSelect: 'text',
                cursor: 'text',
                outline: 'none'
              }}
              onClick={() => inputRef.current?.focus()}
              tabIndex={0}
            >
              {!isConnected && connectionStatus !== 'connecting' ? (
                <div className={classes.emptyState}>
                  <span className={classes.emptyIcon}>💻</span>
                  <p>Terminal not connected to {podName}</p>
                  <button 
                    className={`${classes.iconButton} ${classes.primaryButton}`}
                    onClick={handleReconnect} 
                    style={{ marginTop: '10px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Connect
                  </button>
                </div>
              ) : connectionStatus === 'connecting' ? (
                <div className={classes.emptyState}>
                  <span className={classes.emptyIcon}>🔄</span>
                  <p>Connecting to terminal...</p>
                </div>
              ) : (
                <>
                  <div style={{ color: '#c0caf5' }}>
                    {terminalOutput}
                  </div>
                  {isConnected && (
                    <div style={{ display: 'flex', alignItems: 'center', color: '#c0caf5' }}>
                      <span style={{ color: '#7aa2f7' }}>{prompt}</span>
                      <span>
                        {currentLine.slice(0, cursorPosition)}
                        <span 
                          style={{ 
                            backgroundColor: '#c0caf5', 
                            color: '#1a1b26',
                            animation: 'blink 1s infinite'
                          }}
                        >
                          {currentLine[cursorPosition] || ' '}
                        </span>
                        {currentLine.slice(cursorPosition + 1)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            <input
              ref={inputRef}
              style={{
                position: 'absolute',
                left: '-9999px',
                opacity: 0,
                pointerEvents: 'auto',
                zIndex: -1
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              value=""
              onChange={() => {}} 
              autoFocus
            />
            
            <div className={classes.terminalFooter}>
              <div className={classes.stats}>
                <span className={classes.statItem} style={{ fontSize: '11px', color: '#64748b' }}>
                  Use ↑↓ for history, Tab for completion, Ctrl+C to interrupt, Ctrl+L to clear
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1
        }}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.focus();
            console.log('Terminal focused via overlay click');
          }
        }}
      />
    </div>
  );
};

export default PodTerminal;
