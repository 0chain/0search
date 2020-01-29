import Transaction from '../../entities/transaction.entity';
import Confirmation from '../../entities/confirmation.entity';

/**
 * This class provide service to perform operations regarding chain transactions
 *
 * @public
 * @class TransactionService
 */
export class TransactionService {
  /**
   * @module TransactionService
   * @function getBlockTransaction To fetch list of transactions in a block
   * @param {Object} blockHash: String; skip: Number of records to skip; limit: Number of records to return
   * @returns {Object} transactions: Array<Object>; Number: total number of transactions
   */
  static async getBlockTransaction({ blockHash, skip, limit }) {
    const transactions = await Transaction.find({ block_hash: blockHash })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Transaction.find({ block_hash: blockHash }).count();
    return { transactions, count };
  }

  /**
   * @module TransactionService
   * @function getTransaction To get transaction by its hash
   * @param {String} hash hash of transaction that needs to be fetched
   * @returns {Object} transaction: Object
   */
  static async getTransaction(hash) {
    return Transaction.findOne({ hash }).lean();
  }

  /**
   * @module TransactionService
   * @function getTransactionConfirmation To get confirmation of a transaction by its hash
   * @param {String} hash hash of block that needs to be fetched
   * @returns {Object} Confirmation: Object
   */
  static async getTransactionConfirmation(hash) {
    return Confirmation.findOne({ hash }).lean();
  }

  /**
   * @module TransactionService
   * @function searchTransactions To fetch list of transactions that matches provided query
   * @param {Object} query: Object; skip: Number of records to skip; limit: Number of records to return
   * @returns {Object} transactions: Array<Object>; Number: total number of transactions
   */
  static async searchTransactions({ query, skip, limit }) {
    if (Object.keys(query).includes('metadata')) {
      const searchText = query.metadata
      delete query.metadata
      query['$or'] = [
        { 'metadata.MetaData.Name': searchText },       //Searching via 'name' field
        { 'metadata.MetaData.Path': searchText },       //Searching via 'path' field
        { 'metadata.MetaData.PathHash': searchText },   //Searching via 'path Hash' field
        { 'metadata.MetaData.Hash': searchText },       //Searching via 'transaction hash' field
        { 'client_id': searchText },                    //Searching via 'from' field
        { 'to_client_id': searchText },                 //Searching via 'to' field
        { 'parsed_output.blobber_id': searchText },     //Searching via 'blobber Id' field
        { 'parsed_output.blobbers.id': searchText },    //Searching via 'blobbers' field
        { 'parsed_output.allocation_id': searchText }   //Searching via 'allocation Id' field
      ]
    }
    const transactions = await Transaction.find(query)
      .lean()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Transaction.find(query).count();
    return { transactions, count };
  }
}
