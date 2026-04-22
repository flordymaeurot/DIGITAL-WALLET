import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-money.component.html',
  styleUrl: './send-money.component.scss',
})
export class SendMoneyComponent {
  @Output() transactionSuccess = new EventEmitter<void>();

  receiverEmail = signal('');
  amount = signal('');
  description = signal('');
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private walletService: WalletService) {}

  sendMoney() {
    const amountValue = parseFloat(this.amount());

    if (!this.receiverEmail() || !this.amount() || amountValue <= 0) {
      this.errorMessage.set('Please enter a valid receiver and amount');
      return;
    }

    if (!this.receiverEmail().includes('@')) {
      this.errorMessage.set('Please enter a valid email address');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.walletService.sendMoney(this.receiverEmail(), amountValue, this.description()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(`Successfully sent ${amountValue.toFixed(2)} to ${this.receiverEmail()}!`);
        this.receiverEmail.set('');
        this.amount.set('');
        this.description.set('');
        setTimeout(() => {
          this.successMessage.set('');
          this.transactionSuccess.emit();
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.error || 'Transfer failed. Please try again.');
      },
    });
  }
}
