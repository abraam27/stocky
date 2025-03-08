import { isNotEmpty, isNumber } from 'class-validator';
import { writeFile } from 'fs';
import * as _ from 'lodash';
import * as _uuid from 'uuid';

import { UUID_NAMESPACE } from './constants';
export function uuid(seed?: string): string {
  return isNotEmpty(seed) ? _uuid.v5(seed, UUID_NAMESPACE) : _uuid.v6();
}

export function nanoid(length: number = 23, str: string = ''): string {
  const randomChars = generateRandomChars(length);
  return slugify(str + randomChars);
}

export function flattenObject(obj: any, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], pre));
    } else {
      acc[pre] = obj[key];
    }
    return acc;
  }, {});
}

export function hashCode(obj: unknown): number {
  const jsonString = JSON.stringify(obj);
  let hash = 0;
  if (jsonString.length === 0) return hash;

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export function insensitiveHash(obj: object): string {
  const joinedString = Object.entries(flattenObject(obj))
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join(',');
  return uuid(joinedString);
}

export function toMongoSort(sort: string | Record<string, 1 | -1>) {
  if (typeof sort == 'string') {
    const entries = sort
      .replace(/[\n\t ]/g, ' ')
      .split(' ')
      .map((s) => s.split(':'))
      .map(([k, v]) => [[k], !isNumber(v) ? 1 : +v]);
    return Object.fromEntries(entries);
  }

  return sort;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/-+/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export const toAsync =
  <U, T>(fn: (input: U) => T) =>
  (input: U) =>
    new Promise<T>((resolve, reject) => {
      setImmediate(() => {
        try {
          resolve(fn(input));
        } catch (error) {
          reject(error);
        }
      });
    });

export function generateRandomChars(length: number): string {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function executeMathOperation(
  args: Record<string, number>,
  operationString: string,
) {
  // Define the precedence of operators
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  // Function to convert infix expression to postfix notation
  function infixToPostfix(infix: string) {
    const output = [];
    const stack = [];

    const tokens = infix.replace(/[\t ]+/g, ' ').split(' ');

    for (const token of tokens) {
      if (!isNaN(parseFloat(token)) || args[token] !== undefined) {
        output.push(parseFloat(token) || args[token]);
      } else if (token in precedence) {
        while (
          stack.length &&
          precedence[token] <= precedence[stack[stack.length - 1]]
        ) {
          output.push(stack.pop());
        }
        stack.push(token);
      }
    }

    while (stack.length) {
      output.push(stack.pop());
    }

    return output;
  }

  // Evaluate postfix expression
  function evaluatePostfix(postfix: unknown[]) {
    const stack = [];

    for (const token of postfix) {
      if (typeof token === 'number') {
        stack.push(token);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        switch (token) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            stack.push(a / b);
            break;
        }
      }
    }

    return stack.pop();
  }

  // Convert infix expression to postfix
  const postfixExpression = infixToPostfix(operationString);

  // Evaluate postfix expression
  const result = evaluatePostfix(postfixExpression);

  return result;
}

export function generateRoutesFiles(app: any, appName: string) {
  const express = app.getHttpAdapter().getInstance();

  const routes: Record<string, string> = {};
  express._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      if (r.route.path.includes('app-api')) {
        routes.app_routes =
          (routes.app_routes ?? '') +
          '\n"' +
          r.route.stack[0].method +
          ' ' +
          appName +
          ' ' +
          (r.route.path as string).replace(new RegExp('.*/app-api'), '') +
          '",';
      }
      if (r.route.path.includes('admin-api')) {
        routes.admin_routes =
          routes.admin_routes +
          '\n"' +
          r.route.stack[0].method +
          ' ' +
          appName +
          ' ' +
          (r.route.path as string).replace(new RegExp('.*/admin-api'), '') +
          '",';
      }
      if (r.route.path.includes('internal-api')) {
        routes.internal_api =
          routes.internal_api +
          '\n"' +
          r.route.stack[0].method +
          ' ' +
          appName +
          ' ' +
          (r.route.path as string).replace(new RegExp('.*/internal-api'), '') +
          '",';
      }
      if (r.route.path.includes('integration-api')) {
        routes.integration_api =
          routes.integration_api +
          '\n"' +
          r.route.stack[0].method +
          ' ' +
          appName +
          ' ' +
          (r.route.path as string).replace(
            new RegExp('.*/integration-api'),
            '',
          ) +
          '",';
      }
    }
  });

  for (const key in routes) {
    writeFile(`./${key}.txt`, routes[key], (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
}
