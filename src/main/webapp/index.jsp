<!DOCTYPE html>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<html lang="pt-br">
<head>
	<meta charset="UTF-8">
	<title>Bem-vindo(a) ao Admin - Entrar!</title>
	<meta name="description" content="Helpeo"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>

    <link rel="shortcut icon" href="scripts/img/chave.png" />
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Source+Code+Pro:300,500' rel='stylesheet' type='text/css'>

    <link rel="stylesheet" href="scripts/css/reset.css"/>        
    <link rel="stylesheet" href="scripts/css/stylecontrol.css"/>

</head>
<body class="login">

	<div class="container">
	    <div class="login_box">
	        <img class="login_logo" alt="Admin" title="Admin" src="scripts/img/helpeo_icon_white.png"/>
	        
	        <c:if test="${not empty param.login_error}">
				<span> Your login attempt was not successful, try
					again.<br /> <br /> Reason: <c:out value="${SPRING_SECURITY_LAST_EXCEPTION.message}"/>.
				</span>
	
			</c:if>
	        
	        <form class="login_form" name="work_login" action="<c:url value='j_spring_security_check'/>" method="post" enctype="multipart/form-data">
	            <div class="callback_return m_botton"></div>
	            <input type="hidden" name="callback_action" value="validate-manual">
	            
	            <label class="label">
	                <span class="legend">Seu Usuário:</span>
	                <input type="text" name="username" value="" placeholder="Usuário:" required autofocus />
	            </label>
	
	            <label class="label">
	                <span class="legend">Sua Senha:</span>
	                 <input type="password" name="password" placeholder="Senha:" required/>
	            </label>
	
	            <label class="label_check">
	                <input type="checkbox" name="userRemember" value="true" /> Lembrar!
	            </label>
	
	            <img class="form_load none" style="float: right; margin-top: 3px; margin-left: 10px;" alt="Enviando Requisição!" title="Enviando Requisição!" src="../scripts/img/load.gif"/>
	            <button class="btn btn_blue fl_right">Entrar!</button>
	            
	            <div class="clear"></div>
	        </form>
	        <p class="login_link"><a href="recover.html">Perdeu sua senha?</a></p>
	    </div>
	</div>
	
</body>
</html>