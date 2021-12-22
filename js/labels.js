class Labels {

    constructor(labels) {
        this.list = [];
        this.nextKey = 0;
    }

    addLabel(label) {
        this.list[this.nextKey] = label;

        $('#labels-list').append('<li class="list-group-item d-flex justify-content-between lh-sm labelrow" data-id="' + (this.nextKey) + '">' +
            '<div>' +
            '<h6 class="my-0">' + label.quantity_format() + ' - ' + label.width_format() + ' x ' + label.height_format() + '</h6>' +
            '<span class="text-muted my-1">' + label.liner_format() + '</span> / <span class="text-muted my-1">' + label.material_format() + '</span> / <span class="text-muted my-1">' + label.finish_format() + label.shapepercent_format() + '</span>' +
            '</div>' +
            '<button type="button" class="btn btn-danger delete-label">-</button>' +
            '</li>');
        $('#label-counter').html(parseInt($('#label-counter').text()) + 1);
        this.nextKey++;
        this.calculateWeight();
    }

    removeLabel(id) {
        this.list[id] = null;
        $('#label-counter').html(parseInt($('#label-counter').text()) - 1);
        this.calculateWeight();
    }

    calculateWeight() {
        $('#results').html('');
        for (var label of this.list) {
            if (label == null) {
                continue;
            }

            if (label.height > label.width) {
                var temp = label.width;
                label.width = label.height;
                label.height = temp;
            }

            // Figure out how many rolls
            var rollCount = Math.floor(12.875 / (label.height + 0.125 * 2));
            var rollQuantity = Math.ceil(label.quantity / rollCount);
            var rollLength = 0.125 + (label.width + 0.125) * rollQuantity;
            var rollHeight = 0.125 * 2 + label.height;
            var thickness = label.liner.thickness + label.material.thickness;
            var rollDiameter = Math.sqrt(((thickness * 0.001 * rollLength) / Math.PI) + Math.pow(1.5, 2)) * 2;

            // thickness * rollLength = pi(() - (1.5^2))



            var insertStr = '<li class="list-group-item d-flex justify-content-between lh-sm"><div>';
            insertStr += "<b>Label</b><br />";
            insertStr += "Liner SqFt: " + numeral((rollLength * rollHeight * rollCount) / 12).format('0.00') + " SqFt<br />";
            insertStr += "Material SqFt: " + numeral((label.width * label.height * rollQuantity * label.shapepercent * rollCount) / 12).format('0.00') + " sqFt<br />";
            insertStr += "Finish SqFt: " + numeral((label.width * label.height * rollQuantity * label.shapepercent * rollCount) / 12).format('0.00') + " sqFt<br /><br />";
            insertStr += "Liner Weight: <br />";
            insertStr += "Material Weight: <br />";
            insertStr += "Finish Weight: " + numeral((label.width * label.height * rollQuantity * label.shapepercent * rollCount) / 12 * label.finish.weight).format('0.000') + " lbs.<br />";
            insertStr += "Core Weight: " + numeral(rollCount * 0.25).format('0.000') + " lbs.<br /><br />";
            insertStr += "<b>Roll Stats</b><br />";
            insertStr += numeral(rollCount).format('0,0') + ' Rolls @ ' + numeral(rollQuantity).format('0,0') + ' Each<br />';
            insertStr += "Roll Height: " + numeral(rollHeight).format('0.00') + " Inches<br />";
            insertStr += "Roll Diameter: " + numeral(rollDiameter).format('0.00') + " Inches<br />";
            insertStr += "Roll Weight: <br />";
            insertStr += "</div></li>";

            // 
            $('#results').append(insertStr);

        }
    }
}

class Label {
    constructor(quantity, width, height, liner, material, finish, shapepercent) {
        this.quantity = quantity
        this.height = height;
        this.width = width;
        this.liner = liner;
        this.material = material;
        this.finish = finish;
        this.shapepercent = shapepercent;
    }


    quantity_format() { return numeral(this.quantity).format('0,0') }
    height_format() { return numeral(this.height).format('0.0[0000]') + '"'; }
    width_format() { return numeral(this.width).format('0.0[0000]') + '"'; }
    liner_format() { return this.liner.name; }
    material_format() { return this.material.name; }
    finish_format() { return this.finish.name; }
    shapepercent_format() {
        if (this.shapepercent != 1) {
            return " / " + this.shapepercent * 100 + "%";
        } else {
            return "";
        }
    }

    isValid() {
        if (isNaN(this.quantity) || parseInt(Number(this.quantity)) != this.quantity || isNaN(parseInt(this.quantity, 10))) {
            return false;

        }

        if (isNaN(this.height)) {
            return false;
        }

        if (isNaN(this.width)) {
            return false;
        }

        if (isNaN(this.shapepercent)) {
            return false;
        }

        return true;
    }

    sanitize() {
        this.quantity = Math.max(1, parseInt(this.quantity));
        this.height = Math.max(0.0625, parseFloat(this.height));
        this.width = Math.max(0.0625, parseFloat(this.width));
        this.shapepercent = (parseFloat(this.shapepercent).toFixed(2)) / 100
    }
}

class Liner {

    constructor(id, name, weight, thickness) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.thickness = thickness;
    }

    toString() {
        return this.name;
    }
}

class Material {

    constructor(id, name, weight, thickness) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.thickness = thickness;
    }


    toString() {
        return this.name;
    }
}

class Finish {
    constructor(id, name, weight) {
        this.id = id;
        this.name = name;
        this.weight = weight;
    }
    toString() {
        return this.name;
    }
}