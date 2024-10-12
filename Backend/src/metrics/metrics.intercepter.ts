import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  private readonly httpRequestDurationSeconds: Histogram<string>;
  private readonly httpRequestCounter: Counter<string>;

  constructor() {
    this.httpRequestDurationSeconds = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'status_code', 'path'],
      buckets: [
        0.005,
        0.01,
        0.025,
        0.05,
        0.1,
        0.25,
        0.5,
        1,
        2.5,
        5,
        10,
        Infinity,
      ],
    });

    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'status_code', 'path'],
    });

    register.registerMetric(this.httpRequestDurationSeconds);
    register.registerMetric(this.httpRequestCounter);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.route?.path || request.url;

    const end = this.httpRequestDurationSeconds.startTimer({ method, path });

    return next.handle().pipe(
      tap((response) => {
        const statusCode =
          response?.statusCode ||
          context.switchToHttp().getResponse().statusCode;
        this.httpRequestCounter.inc({ method, status_code: statusCode, path });
        end({ method, status_code: statusCode, path });
      }),
    );
  }
}
