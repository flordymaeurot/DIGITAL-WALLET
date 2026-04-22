import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionResponse {
  transactions: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactionHistory(page: number = 1, limit: number = 20): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  getTransactionDetails(transactionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${transactionId}`);
  }
}
