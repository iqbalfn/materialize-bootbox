let ID = {};

ID.index = 0;

ID.get = function(prefix){
    return (prefix||'') + (ID.index++);
}