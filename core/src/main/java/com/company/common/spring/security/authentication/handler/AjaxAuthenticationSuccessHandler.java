package com.company.common.spring.security.authentication.handler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.company.common.context.Constant;
import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AjaxAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
 
    public AjaxAuthenticationSuccessHandler() {
    }
 
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
 
        ObjectMapper objectMapper = new ObjectMapper();
        response.setHeader("Content-Type", "application/json;charset=UTF-8");
		JsonGenerator jsonGenerator = objectMapper.getFactory().createGenerator(response.getOutputStream(),
                JsonEncoding.UTF8);
        try {
                          
        	Map<String, Object> context = new HashMap<String, Object>();
    		context.put(Constant.RESPONSE_CODE, Constant.SUCCEED_CODE_VALUE);
            objectMapper.writeValue(jsonGenerator, context);
        } catch (Exception ex) {
            throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getMessage(), ex);
        }
    }
}