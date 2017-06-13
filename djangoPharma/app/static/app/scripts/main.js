$(document).ready(function () {

    var url = 'http://localhost:8000';
    syncLocalDB();
    function addDashboardMessage(msg, type) {
        if (!type) {
            type = 'info';
        }
        var now = new Date(Date.now());
        var formatted_time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

        $("#myMessages").append("<li class='" + type + "'><a><span>" + formatted_time + "</span>  - " + msg + "</a></li>");
    }

    function syncLocalDB() {
        $.ajax({
            type: 'GET',
            url: url + '/ajax/syncdb',
            success: function (data) {

                addDashboardMessage('Sync local DB result:' + data.result)
            },
            error: function (xhr, textStatus, errorThrown) {
                addDashboardMessage('Sync Error:' + data.error_message, 'danger')
            }
        });
    }

    // add to cart
    $('#addToCart').on('click', function () {
        var quantity = $('#quantity').val();
        var drug_id = $('#drugId').val();
        var token = $('input[name=csrfmiddlewaretoken]').val();
        // hide the messages
        hideAlertResultMessages();
        var data = {
            quantity: quantity,
            drug_id: drug_id
        };
        $.ajax({
            type: "POST",
            url: url + '/add_to_cart',
            data: data, beforeSend: function (xmlHTTPRequest) {
                xmlHTTPRequest.setRequestHeader('X-CSRFToken', token)
            },
            success: function () {
                $('#cart-alert-success').removeClass('hidden')
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#cart-alert-fail').removeClass('hidden')
            }
        });
    });

    $('.updateCart').on('click', function (event) {
        var quantity = $('#quantity').val();
        var drug_id = $(event.currentTarget).attr('id');
        var token = $('input[name=csrfmiddlewaretoken]').val();
        // hide the messages
        hideAlertResultMessages();
        var data = {
            quantity: quantity,
            drug_id: drug_id
        };
        $.ajax({
            type: "POST",
            url: url + '/update_cart',
            data: data, beforeSend: function (xmlHTTPRequest) {
                xmlHTTPRequest.setRequestHeader('X-CSRFToken', token)
            },
            success: function () {
                $('#cart-alert-success').removeClass('hidden')
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#cart-alert-fail').removeClass('hidden')
            }
        });
    });

    $('.removeFromCart').on('click', function () {
        debugger;
        var drug_id = $(event.currentTarget).attr('id')
        var token = $('input[name=csrfmiddlewaretoken]').val();
        // hide the messages
        hideAlertResultMessages();
        var data = {
            drug_id: drug_id
        };
        $.ajax({
            type: "POST",
            url: url + '/remove_from_cart',
            data: data, beforeSend: function (xmlHTTPRequest) {
                xmlHTTPRequest.setRequestHeader('X-CSRFToken', token)
            },
            success: function () {
                $('#cart-alert-success').removeClass('hidden')
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#cart-alert-fail').removeClass('hidden')
            }
        });
    });

    function hideAlertResultMessages() {
        $('#cart-alert-success').addClass('hidden');
        $('#cart-alert-fail').addClass('hidden');
    }

    /* ------------  add drug functionality     -------------------------------- */

    $('select[name=chooseDrug]').on('change', function () {
        var drugId = $(this).find(":selected").val();
        if (!drugId || drugId === '-1') {
            // clear all fields
            $('input[name=id]').val('');
            $('input[name=friendly_name]').val('');
            $('input[name=price]').val('');
            $('input[name=description]').val('');
            $('input[name=availability]').val('');
            $('select[name=category]').find("option:selected").removeAttr("selected");
            $('form #mainFields').addClass('hidden');
        }
        // for the selected drug fetch the details for the form
        $.ajax({
            type: "GET",
            url: 'http://connect.opengov.gr:3000/drugs/' + drugId,
            success: function (resp) {
                // fill the values in the form
                $('input[name=id]').val(resp.id);
                $('input[name=friendly_name]').val(resp.name);
                $('input[name=price]').val(resp.price_retail);
                // show the form
                $('form #mainFields').removeClass('hidden');
            }
        });
    });

    /*------------------------- Submit Order ----------------------- */


    $('#submitOrder').on('click', function () {
        // hide the failure message
        $('#checkout-fail').addClass('hidden');
        // get the CSRF token
        var token = $('input[name=csrfmiddlewaretoken]').val();
        // get values
        var paymentType = $('select[name=paymentType]').find(":selected").val();
        var shipmentType = $('select[name=shipmentType]').find(":selected").val();
        var comments = $('textarea[name=comments]').val();

        var data = {
            paymentType: paymentType,
            shipmentType: shipmentType,
            comments: comments
        };

        $.ajax({
            type: "POST",
            url: url + '/submit_order',
            data: data, beforeSend: function (xmlHTTPRequest) {
                xmlHTTPRequest.setRequestHeader('X-CSRFToken', token)
            },
            success: function () {
                debugger;
               window.location = url + '/submit_order_result';
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#checkout-fail').removeClass('hidden');
            }
        });
    });

    /*---------------- admin update order status -------------------------- */



    $('#updateOrder').on('click', function () {
        // hide the failure message
        $('#update-fail').addClass('hidden');
        // get the CSRF token
        var token = $('input[name=csrfmiddlewaretoken]').val();
        // get values
        var order_id = $('#orderId').val();
        var status = $('select[name=statusType]').find(":selected").val();

        var data = {
            order_id: order_id,
            status: status
        };

        $.ajax({
            type: "POST",
            url: url + '/admin/orders/update',
            data: data, beforeSend: function (xmlHTTPRequest) {
                xmlHTTPRequest.setRequestHeader('X-CSRFToken', token)
            },
            success: function () {
               window.location = url + '/admin/orders';
            },
            error: function (xhr, textStatus, errorThrown) {
                //window.location = url + '/admin/orders';
            }
        });
    });



});
