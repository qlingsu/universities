class Page {
    constructor(pageSize, pageNum, rows) {
        this.pageSize = pageSize < 0 ? 15 : Math.ceil(pageSize);
        this.pageNum = pageNum < 1 ? 1 : Math.ceil(pageNum);
        this.rows = [];
        this.total = rows.length;
        if (rows && rows.length > 0) {
            let total = rows.length;
            let start = (pageNum - 1) * pageSize;
            let end = pageNum * pageSize;
            if (start < total && end < total) {
                this.rows = rows.slice(start, end);
            } else if (start < total && end >= total) {
                this.rows = rows.slice(start, total);
            } else if (start <= total) {
                this.rows = [];
            }
        }
    }
    getRows(){
        return this.rows;
    }
}
module.exports = Page