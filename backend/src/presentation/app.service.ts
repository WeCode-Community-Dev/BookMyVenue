import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <h1>Welcome to BookMyVenue API</h1>
    <p>
      Explore our API documentation at <a href="/docs">/docs</a>
    </p>
    `;
  }
}
