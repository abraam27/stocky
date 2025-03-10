import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LoggedUser } from 'src/common/decorators/genwin';
import { User } from 'src/users/user.dto';
import { TransactionService } from './transaction.service';

@Controller('api/transactions')
export class TransactionsAdminController {
  constructor(private TransactionService: TransactionService) {}

  @Get()
  async getTransactions(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.TransactionService.getTransactions(options);
  }

  @Get(':transaction_id')
  async getTransactionById(@Param('transaction_id') transactionId: string) {
    const Transaction =
      await this.TransactionService.getTransactionById(transactionId);
    // const isAdmin = isItemAdmin(Transaction, user);
    // if (!isAdmin) throw new AuthorizationError('Action not allowed');
    return Transaction;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.TransactionService.createTransaction(body, user);
  }

  @Put(':transaction_id')
  async updateTransaction(
    @Param('transaction_id') transactionId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.TransactionService.updateTransaction(
      transactionId,
      body,
      user,
    );
  }

  @Delete(':transaction_id')
  async deleteTransaction(
    @Param('transaction_id') transactionId: string,
    @LoggedUser() user: User,
  ) {
    return await this.TransactionService.deleteTransaction(transactionId, user);
  }
}
