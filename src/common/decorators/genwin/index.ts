import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { omit } from 'lodash';
import { User } from 'src/users/dtos/user.dto';

export const LoggedUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

function requestSource(req: Request) {
  const ip = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? null;
  const fixedSource = {
    host: req.headers.host ?? null,
    origin: req.headers.origin?.replace(/^http(s)?:\/\//g, '') ?? null,
    agent: req.headers['user-agent'] ?? null,
    url: req.originalUrl,
    ip: !!ip && typeof ip == 'object' ? ip.join(', ') : ip,
  };

  const addedSource: Record<string, any> = {};
  const sourceHeader: string =
    !!req.headers.source && typeof req.headers.source == 'object'
      ? req.headers.source.join(',')
      : (req.headers.source as string);

  sourceHeader?.split(',').forEach((item: string) => {
    const spliced = item.split(':');
    if (spliced.length === 2) {
      addedSource[spliced[0]] = spliced[1];
    }
  });

  return { ...addedSource, ...fixedSource };
}
function requestStruct(httpRequest: Request & { user?: User }) {
  return {
    path: httpRequest.path,
    method: httpRequest.method,
    pathParams: httpRequest.params,
    queryParams: httpRequest.query,
    body: omit(httpRequest.body, ['context']),
    user: {
      _id: httpRequest.user?._id ?? 'anonymous',
      role: httpRequest.user?.role ?? 'guest',
      username: `${httpRequest.user?.username ?? ''}`,
    },
    source: requestSource(httpRequest),
    origin: requestSource(httpRequest).origin,
  };
}

export const RequestStruct = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const httpRequest = ctx.switchToHttp().getRequest();
    const reqStruct = requestStruct(httpRequest);
    return !!data ? reqStruct[data] : reqStruct;
  },
);

export const RequestSource = () => RequestStruct('source');
