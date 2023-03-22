import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    if (data) {
      // return only the specified cookie unsigned
      let signedCookie = request.cookies?.[data];
      return (signedCookie) ? request.unsignCookie(signedCookie).value : undefined;
    }
    
    // return every cookie unsigned (doing this is a bit ineficcient since controller will not always try to access every cookie so we really don't need to unsign every one of them...)
    for (let cookie in request.cookies) {
      let unsignedCookie = request.unsignCookie(request.cookies[cookie]!).value;
      // I want to return undefined to replicate the behaviour one would find in the controller method, when a cookie is not found 
      let newRequestCookie = (unsignedCookie === null) ? undefined : unsignedCookie;
      request.cookies[cookie] = newRequestCookie;
    }
    return request.cookies
  }
);