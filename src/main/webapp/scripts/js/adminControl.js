/* 
 * Biblioteca de evendos jQuery do Painel Work Control Pro Content Manager
 * Created on : 02/04/2016, 19:09:21
 * Author     : Anderson O. Aristides
 */

//JQUERY START
$(function () {
	
	//URL API
	var sAction = 'http://' + window.location.host + '/helpeo/none/api/';
	
	$(".maskTel").mask("(99) 9999-9999?9");
	$(".maskCep").mask("99999-999");
	$(".maskData").mask("99/99/9999");
	$(".maskCpf").mask("999.999.999-99");
	$(".maskCnpj").mask("99.999.999/9999-99");

	// Controla Tipo Pessoa
	$("input[name=tipoPessoa]:radio").change(function() {
		console.log($(this).val());
		$('input[name=cpfCnpj]').removeClass('maskCpf');
		$('input[name=cpfCnpj]').unmask();// Remove a mascara
		if ($(this).val() === "F") {// Acaso seja CPF
			$("input[name=cpfCnpj]").attr('placeholder', 'CPF:');
			$("input[name=cpfCnpj]").mask("999.999.999-99");
		} else {// Acaso seja Cnpj
			$("input[name=cpfCnpj]").attr('placeholder', 'CNPJ:');
			$("input[name=cpfCnpj]").mask("99.999.999/9999-99");
		}
	});
	
	//Coloca todos os formulários em AJAX mode e inicia LOAD ao submeter!
    $('form').not('.ajax_off').submit(function () {
        var form = $(this);
        var callback_action = form.find('input[name="callback_action"]').val();
        
        $.ajax({
            url: sAction + callback_action,
            data: JSON.stringify(form.serializeObject()),
            type: 'POST',
            contentType: "application/json",
            beforeSend: function () {
                form.find('.form_load').fadeIn('fast');
                $('.trigger_ajax').fadeOut('fast');
            },
            success: function (data) {
            	console.clear();
            	console.log(data);
            	
                //REMOVE LOAD
                form.find('.form_load').fadeOut('slow', function () {
                    
                    //EXIBE CALLBACKS
                    if (data.message) {
                        var CallBackPresent = form.find('.callback_return');
                        if (CallBackPresent.length) {
                            CallBackPresent.html(Trigger(data.message, data.tipoError));
                            $('.trigger_ajax').fadeIn('slow');
                            if (data.tipoError === 'success') {
                            	form.reset();
                            }
                        } 
                    }
                    
                    //REDIRECIONA
                    if (data.redirect) {
                        window.setTimeout(function () {
                            window.location.href = data.redirect;
                        }, 1500);
                    }
                    
                    //CLEAR INPUT FILE
                    form.find('input[type="file"]').val('');
                });
            }
        });
        return false;
    });
    
    //Busca Cep
    $('.ajaxBuscaCep').blur(function() {
		var form = $('form');
		var cep = $(this).val();
		var obj = {};

		obj["cep"] = cep;

		$.ajax({
			url : sAction + '/busca-cep',
			data : JSON.stringify(obj),
			type : 'POST',
			contentType : "application/json",
			success : function(response) {
				console.log(response);
				if (response.erro === true) {
					triggerError(response.message);
				} else {
					form.find('input[name="logradouro"]').val(
							response.logradouro);
					form.find('input[name="complemento"]').val(
							response.complemento);
					form.find('input[name="bairro"]').val(
							response.bairro);
					form.find('input[name="estado"]').val(response.uf);
					form.find('input[name="cidade"]').val(
							response.localidade);
				}
			}
		});

		return false;
	});

    
    //Change Cliente 
    $('.ajaxChangeCliente').change(function() {
    	var table = $('.ajaxTableResult');
    	
    	if ($(this).val() !== '') {
    		$.post(sAction + 'endereco-cliente', {clienteId: $(this).val()}, function(response) {
        		$.each(response, function(i) {
        			console.log(response[i]);
        			table.append('<tr><td>'+response[i].idEndereco+'</td><td>'+response[i].logradouro+', '+response[i].numero+' - '+response[i].bairro+', '+response[i].cidade+'/'+response[i].estado+'</td><td>'+response[i].latitude+'</td><td>'+response[i].longitude+'</td><td>'+response[i].referencia+'</td></tr>');
        		});
        		
            });
    	} else {
    		table.empty();
    	}
    });
    
    //Change Ramo
    $('.ajaxChangeRamo').change(function() {
    	var table = $('.ajaxTableResult');
    	
    	if ($(this).val() !== '') {
    		$.post(sAction + 'tipo-servico-ramo', {ramoId: $(this).val()}, function(response) {
        		$.each(response, function(i) {
        			console.log(response[i]);
        			table.append('<tr><td>'+response[i].idTipoServicos+'</td><td>'+response[i].descricaoTipoServico+'</td><td>'+response[i].tipoServicoUrgente+'</td></tr>');
        		});
        		
            });
    	} else {
    		table.empty();
    	}
    });
    
    //Lista Tipos de Serviço pro Prestador de Servico
	$('.ajaxChangeRamosPrestador').change(function() {
		var tipoServico = $('.ajaxTipoServicos');
		
		console.log($(this).val());
		
		if ($(this).val() !== '') {
			$.post(sAction + 'tipo-servico-ramo', {ramoId: $(this).val()}, function(response) {
				tipoServico.empty();
				$.each(response, function(i) {
					console.log(response[i]);
					tipoServico.append('<label class="min"><input type="checkbox" name="objIdTipoServico" value="' + response[i].idTipoServicos + '"/>' + response[i].descricaoTipoServico + '</label>');
				});
			});
		} else {
			tipoServico.empty();
		}
	});
    
});

//############## SERIALIZE FORM JSON
$.fn.serializeFormJSON = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//############## SERIALIZE FORM JSON
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//############## MODAL MESSAGE
function Trigger(Message, ErrNo) {
    $('.trigger_ajax').fadeOut('fast', function () {
        $(this).remove();
    });
    
    var CssClass = (ErrNo == "info" ? 'trigger_info' : (ErrNo == "warning" ? 'trigger_alert' : (ErrNo == "error" ? 'trigger_error' : 'trigger_success')));
    var divMsg = '<div class="trigger trigger_ajax '+ CssClass + '">' + Message + '<span class="ajax_close"></span></div>';
    
    return divMsg;
}

//Function Reset Criada para resetar os formularios nas modais 
jQuery.fn.reset = function () {
    this.each(function () {
        if ($(this).is('form')) {
            var button = jQuery(jQuery('<input type="reset" />'));
            button.hide();
            $(this).append(button);
            button.click().remove();
        } else if ($(this).parent('form').size()) {
            var button = jQuery(jQuery('<input type="reset" />'));
            button.hide();
            $(this).parent('form').append(button);
            button.click().remove();
        } else if ($(this).find('form').size()) {
            $(this).find('form').each(function () {
                var button = jQuery(jQuery('<input type="reset" />'));
                button.hide();
                $(this).append(button);
                button.click().remove();
            });
        }
    });

    return this;
};