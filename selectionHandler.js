class Selector {

    constructor() {
        this.entity = null;
    };

    isSelected(entity) {
        if (this.entity != null) {
            return this.entity === entity;
        }
    };

    select(entity) {
        if (this.entity == null) {
            this.entity = entity;
        } else {
            console.log('rejected selecting ' + entity);
        }
    };

    deselect(entity) {
        if (this.entity!=null) {
            this.entity = null;
        }
    };

    getSelected() {
        return this.entity;
    }

    draw(ctx) {
    };
}

var selector = new Selector();