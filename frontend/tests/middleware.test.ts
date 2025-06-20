/**
 * @jest-environment node
 */

import { middleware } from '@/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

describe('Middleware', () => {
  const createMockRequest = (pathname: string, isAuthenticated: boolean) => {
    const url = `http://localhost:3000${pathname}`;
    const request = {
      nextUrl: new URL(url),
      url,
      cookies: {
        has: jest.fn().mockReturnValue(isAuthenticated),
      },
    } as unknown as NextRequest;
    return request;
  };

  it('должен перенаправлять на /login, если пользователь не аутентифицирован и заходит на защищенную страницу', () => {
    const request = createMockRequest('/hash', false);
    const response = middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    if (response instanceof NextResponse) {
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    }
  });

  it('должен разрешать доступ к /login, если пользователь не аутентифицирован', () => {
    const request = createMockRequest('/login', false);
    const response = middleware(request);
    expect(response.status).toBe(200); // NextResponse.next() вернет status 200
  });

  it('должен перенаправлять на /hash, если аутентифицированный пользователь заходит на /login', () => {
    const request = createMockRequest('/login', true);
    const response = middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    if (response instanceof NextResponse) {
      expect(response.headers.get('location')).toBe('http://localhost:3000/hash');
    }
  });

  it('должен разрешать доступ к защищенной странице, если пользователь аутентифицирован', () => {
    const request = createMockRequest('/hash', true);
    const response = middleware(request);
    expect(response.status).toBe(200);
  });
});
