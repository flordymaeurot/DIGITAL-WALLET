import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-cash-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cash-in.component.html',
  styleUrl: './cash-in.component.scss',
})
export class CashInComponent {
  @Output() transactionSuccess = new EventEmitter<void>();

  amount = signal('');
  description = signal('');
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private walletService: WalletService) {}

  cashIn() {
    const amountValue = parseFloat(this.amount());

    if (!this.amount() || amountValue <= 0) {
      this.errorMessage.set('Please enter a valid amount');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.walletService.cashIn(amountValue, this.description()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(`Successfully added ${amountValue.toFixed(2)} to your wallet!`);
        this.amount.set('');
        this.description.set('');
        setTimeout(() => {
          this.successMessage.set('');
          this.transactionSuccess.emit();
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.error || 'Cash-in failed. Please try again.');
      },
    });
  }
}
