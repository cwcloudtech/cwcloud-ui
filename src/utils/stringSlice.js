const sliceIfNeeded = (value, maxSize) => {
    if (! value) {
        return '';
    }
 
    return (value.length < maxSize) ? value : value.slice(0, maxSize) + '...';
 }
 
 export default sliceIfNeeded; 