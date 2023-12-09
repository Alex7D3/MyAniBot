const fs = require('node:fs');
const path = require('node:path');

/**BFS to find command files**/
module.exports = function(directory) {
    const queue = [directory];
    const commandArr = [];
    while(queue.length) {
        const curPath = queue.shift();
        if(fs.statSync(curPath).isDirectory()) {
            const subFiles = fs.readdirSync(curPath, { withFileType: true });
            for(const file of subFiles)
                queue.push(path.join(curPath, file));
        }
        else if(curPath.endsWith('js')) {
            commandArr.push(require(curPath));
        }
    }
    return commandArr;
};