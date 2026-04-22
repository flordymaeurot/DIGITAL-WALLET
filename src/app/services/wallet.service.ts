import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface WalletResponse {
  wallet: {
    id: string;
    balance: number;
    currency: string;
    createdAt: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = 'http://localhost:3000/api/wallet';
  private walletSubject = new BehaviorSubject<any>(null);
  public wallet$ = this.walletSubject.asObservable();

  constructor(private http: HttpClient) {}

  getWallet(): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(this.apiUrl).pipe(
      tap((response) => {
        this.walletSubject.next(response.wallet);
      })
    );
  }

  cashIn(amount: number, description?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cash-in`, { amount, description }).pipe(
      tap(() => {
        this.refreshWallet();
      })
    );
  }

  sendMoney(receiverEmail: string, amount: number, description?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-money`, { receiverEmail, amount, description }).pipe(
      tap(() => {
        this.refreshWallet();
      })
    );
  }

  private refreshWallet() {
    this.getWallet().subscribe();
  }
}
