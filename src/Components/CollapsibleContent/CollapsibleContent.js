import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// Measures the content height and forwards max-height transition events.
const useScrollHeight = (ref, { onTransitionStart, onTransitionEnd } = {}) => {
    const [scrollHeight, setScrollHeight] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;
        const update = () => setScrollHeight(element.scrollHeight);
        update();
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
        observer?.observe(element);
        const handleStart = (e) => e.propertyName === 'max-height' && onTransitionStart?.(e);
        const handleEnd = (e) => {
            if (e.propertyName !== 'max-height') return;
            update();
            onTransitionEnd?.(e);
        };
        element.addEventListener('transitionstart', handleStart);
        element.addEventListener('transitionend', handleEnd);
        return () => {
            observer?.disconnect();
            element.removeEventListener('transitionstart', handleStart);
            element.removeEventListener('transitionend', handleEnd);
        };
    }, [ref, onTransitionStart, onTransitionEnd]);

    return { scrollHeight };
};

const STATUS = {
    COLLAPSED: 'COLLAPSED',
    PRE_EXPANDED: 'PRE_EXPANDED',
    EXPANDED: 'EXPANDED',
    PRE_COLLAPSED: 'PRE_COLLAPSED'
};

function CollapsibleContent({
    children,
    expanded,
    style,
    transitionDuration = '.425s',
    transitionTimingFunction = 'ease-in-out',
    onTransitionStart,
    onTransitionEnd,
    ...others
}) {
    const contentContainerRef = useRef(null);
    const [status, setStatus] = useState(expanded ? STATUS.EXPANDED : STATUS.COLLAPSED);
    const { scrollHeight } = useScrollHeight(contentContainerRef, {
        onTransitionStart,
        onTransitionEnd
    });
    let transitionStyles;
    switch (status) {
        case STATUS.EXPANDED:
            transitionStyles = { maxHeight: '100vh', transitionDuration: '.001s' };
            break;
        case STATUS.PRE_COLLAPSED:
            transitionStyles = { maxHeight: scrollHeight, transitionDuration: '.001s' };
            break;
        case STATUS.PRE_EXPANDED:
            transitionStyles = { maxHeight: scrollHeight };
            break;
        case STATUS.COLLAPSED:
            transitionStyles = { maxHeight: 0 };
            break;
        default:
            transitionStyles = { maxHeight: scrollHeight, transitionDuration: '.001s' };
    }

    useEffect(() => {
        if (expanded) {
            if (status === STATUS.COLLAPSED) {
                setStatus(STATUS.PRE_EXPANDED);
            } else if (status === STATUS.PRE_EXPANDED) {
                setTimeout(() => setStatus(STATUS.EXPANDED), 800);
            }
        } else if (!expanded) {
            if (status === STATUS.EXPANDED) {
                setStatus(STATUS.PRE_COLLAPSED);
            } else if (status === STATUS.PRE_COLLAPSED) {
                setTimeout(() => setStatus(STATUS.COLLAPSED), 100);
            }
        }
    }, [expanded, status]);

    return (
        <div
            {...others}
            style={{
                overflow: 'hidden',
                transitionProperty: 'max-height',
                transitionTimingFunction,
                transitionDuration,
                ...transitionStyles,
                ...style
            }}
            ref={contentContainerRef}
        >
            {children}
        </div>
    );
}

CollapsibleContent.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
        .isRequired,
    expanded: PropTypes.bool,
    onTransitionStart: PropTypes.func,
    onTransitionEnd: PropTypes.func,
    style: PropTypes.object,
    transitionDuration: PropTypes.string,
    transitionTimingFunction: PropTypes.string
};

export default CollapsibleContent;
