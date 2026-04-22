import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WalletService } from '../../services/wallet.service';
import { TransactionService } from '../../services/transaction.service';
import { CashInComponent } from '../../components/cash-in/cash-in.component';
import { SendMoneyComponent } from '../../components/send-money/send-money.component';
import { TransactionHistoryComponent } from '../../components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CashInComponent, SendMoneyComponent, TransactionHistoryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  currentUser = signal<any>(null);
  balance = signal<number>(0);
  currency = signal('USD');
  isLoading = signal(true);
  activeTab = signal<'overview' | 'cash-in' | 'send' | 'history'>('overview');

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });

    this.loadWallet();
  }

  loadWallet() {
    this.isLoading.set(true);
    this.walletService.getWallet().subscribe({
      next: (response) => {
        this.balance.set(response.wallet.balance);
        this.currency.set(response.wallet.currency);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load wallet:', error);
        this.isLoading.set(false);
      },
    });
  }

  setActiveTab(tab: 'overview' | 'cash-in' | 'send' | 'history') {
    this.activeTab.set(tab);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onTransactionSuccess() {
    this.loadWallet();
    this.activeTab.set('overview');
  }
}
