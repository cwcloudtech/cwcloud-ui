import React, { useRef, useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../../Context/GlobalContext';
import colors from '../../Context/Colors';
import classes from './SearchModal.module.css';
import routes from './routes.json';

const SearchModal = ({ isOpen, onClose }) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const is_admin = context.user?.is_admin;
  const enabled_features = context.user?.enabled_features || {};
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const isRouteAccessible = (route) => {
    if (route.path.startsWith('/admin')) {
      return is_admin;
    }

    if (route.feature) {
      return enabled_features[route.feature] === true;
    }

    return true;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (event.key === 'Enter' && selectedIndex >= 0) {
      handleResultClick(searchResults[selectedIndex].path);
    }
  };

  const handleOutsideClick = (event) => {
    if (event.target === modalRef.current) {
      onClose();
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase().trim();
    setSelectedIndex(-1);
    
    if (!query) {
      setSearchResults([]);
      return;
    }

    const currentPath = window.location.pathname;

    const filteredRoutes = routes.filter(route => {
      const matchesQuery = route.name.toLowerCase().includes(query) || 
                          route.path.toLowerCase().includes(query);
      
      if (!matchesQuery || route.path === currentPath) return false;

      return isRouteAccessible(route);
    });

    setSearchResults(filteredRoutes);
  };

  const handleResultClick = (path) => {
    navigate(path);
    onClose();
  };

  const getCardStyle = (index) => ({
    '--card-background': 'rgba(60, 73, 86, 0.1)',
    '--card-hover-background': _mode === 'dark' ? colors.sideBackground.dark : colors.sideBackground.light,
    '--card-text': _mode === 'dark' ? colors.mainText.dark : colors.mainText.light,
    '--card-border': _mode === 'dark' ? colors.border.dark : colors.border.light,
    backgroundColor: selectedIndex === index ? 
      (_mode === 'dark' ? colors.blue.dark : colors.blue.light) :
      'var(--card-background)',
    color: selectedIndex === index ? '#ffffff' : 'var(--card-text)',
    borderColor: selectedIndex === index ? 
      (_mode === 'dark' ? colors.blue.dark : colors.blue.light) : 
      'var(--card-border)'
  });

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef} 
      className={`${classes.modal} ${isOpen ? classes.modalOpen : ''}`}
      onClick={handleOutsideClick}
      style={{
        '--modal-background': _mode === 'dark' ? colors.mainBackground.dark : colors.mainBackground.light,
        '--modal-border': _mode === 'dark' ? colors.border.dark : colors.border.light,
        '--input-background': _mode === 'dark' ? colors.secondBackground.dark : colors.secondBackground.light,
        '--input-border': _mode === 'dark' ? colors.textAreaBorder.dark : colors.textAreaBorder.light,
        '--input-text': _mode === 'dark' ? colors.mainText.dark : colors.mainText.light
      }}
    >
      <div 
        className={classes.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          className={classes.searchInput}
          placeholder={context.counterpart('searchModal.typeToSearch')}
          ref={searchInputRef}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <div className={classes.searchResults} ref={resultsRef}>
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div 
                key={result.path} 
                className={`${classes.searchResultCard} ${selectedIndex === index ? classes.selected : ''}`}
                style={getCardStyle(index)}
                onClick={() => handleResultClick(result.path)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className={classes.resultName}>{result.name}</span>
                <span className={classes.resultPath}>{result.path}</span>
              </div>
            ))
          ) : (
            <div className={classes.noResults}>
              {searchInputRef.current?.value ? `${context.counterpart('searchModal.noResultsFound')}` : `${context.counterpart('searchModal.startTypingToSearch')}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
