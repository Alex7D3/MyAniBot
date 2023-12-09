/**Levenshtein Distance (two vector approach)**/
function lev(w1, w2) {
    const [n, m] = [w1.length, w2.length];
    let prev = new Array(m + 1);
    let cur;
    for(let i = 0; i <= m; i++) {
        prev[i] = i;
    }
    for(let i = 1; i <= n; i++) {
        cur = new Array(m + 1).fill(0);
        cur[0] = i;
        for(let j = 1; j <= m; j++) {
            if(w1.charAt(i - 1) == w2.charAt(j - 1))
                cur[j] = prev[j - 1];
            else
                cur[j] = 1 + Math.min(
                    prev[j - 1],
                    prev[j],
                    cur[j - 1],
                );
        }
        prev = cur;
    }
    return cur[m];
}
module.exports = function(query, data_list) {
    for(const { node } of data_list) {
        const { alternative_titles: alts } = node;
        node.min_lev = Math.min(...alts.synonyms.map(t => lev(query, t)), lev(query, alts.en), lev(query, node.title));
    }
    return data_list.reduce(({ node: node_a }, { node: node_b }) => node_a.min_lev < node_b.min_lev ? { node: node_a } : { node: node_b });
};