import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss',
})
export class TransactionHistoryComponent implements OnInit {
  transactions = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  currentPage = signal(1);
  totalPages = signal(0);
  pageSize = 20;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.transactionService.getTransactionHistory(this.currentPage(), this.pageSize).subscribe({
      next: (response) => {
        this.transactions.set(response.transactions);
        this.totalPages.set(response.pagination.pages);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load transactions:', error);
        this.errorMessage.set('Failed to load transaction history');
        this.isLoading.set(false);
      },
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadTransactions();
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadTransactions();
    }
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'CASH_IN':
        return '💵';
      case 'SEND':
        return '📤';
      case 'RECEIVE':
        return '📥';
      default:
        return '💳';
    }
  }

  getTransactionColor(type: string): string {
    switch (type) {
      case 'CASH_IN':
        return 'cash-in';
      case 'SEND':
        return 'send';
      case 'RECEIVE':
        return 'receive';
      default:
        return 'default';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}
