function Pagination(baseUrl) {
    let page = 0;
    let pagingSegment = "/of/";

    this.nxt = function () {
        page++;
    }

    this.prv = function () {
        page--;
    }

    this.render = function () {
        return baseUrl + pagingSegment + page;
    }
}