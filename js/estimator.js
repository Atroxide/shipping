liners = [];
liners[0] = new Liner(0, "1.2 PET", 1, 1.2);
liners[1] = new Liner(1, "Etc.", 2, 0);

materials = [];
materials[0] = new Material(0, "White BOPP", 1, 2.4);
materials[1] = new Material(1, "Etc.", 2, 0);

finishes = []
finishes[0] = new Finish(0, "Gloss", 0.00005678998);
finishes[1] = new Finish(1, "Etc.", 2);

labels = new Labels();


$("#addLabelForm").submit(function(event) {
    quantity = $("#quantity").val();
    width = $("#width").val();
    height = $("#height").val();
    linerId = $("#liner-select").val();
    materialId = $("#material-select").val();
    finishId = $("#finish-select").val();

    if ($("#ratio").val().length === 0) {
        ratio = 100;
    } else {
        ratio = $("#ratio").val();
    }

    newLabel = new Label(quantity, width, height, liners[linerId], materials[materialId], finishes[finishId], ratio);
    if (newLabel.isValid()) {
        newLabel.sanitize();
        labels.addLabel(newLabel);

        $("#addLabelForm").removeClass("was-validated");
        $("#addLabelForm").trigger("reset");

    }

    return false;
});
$("#labels-list").on('click', ".delete-label", function(event) {
    labelrow = $(this).closest(".labelrow");
    id = $(labelrow).data("id");
    $(labelrow).remove();

    labels.removeLabel(id);

});


$(document).ready(function() {

    liners.forEach(function(liner) {
        $('#liner-select').append('<option value="' + liner.id + '">' + liner.name + '</option>');
    });

    materials.forEach(function(material) {
        $('#material-select').append('<option value="' + material.id + '">' + material.name + '</option>');
    });

    finishes.forEach(function(finish) {
        $('#finish-select').append('<option value="' + finish.id + '">' + finish.name + '</option>');
    });
});

function checkQuantity(value, validator) {
    return (!isNaN(value) && quantity > 0);
};