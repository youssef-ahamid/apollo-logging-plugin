import chalk, { type ColorName } from 'chalk';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestListener
} from '@apollo/server';

type LogType = 'info' | 'error' | 'success';

/**
 * Map of log types to colors
 */
const logColors = new Map<LogType, ColorName>([
  ['info', 'blue'],
  ['error', 'red'],
  ['success', 'green']
]);

/**
 * Print a log message to the console
 * @param {LogType} level or color
 * @param {GraphQLRequestContext<BaseContext>} data
 * @param {string} message
 *
 * @example
 * const log = new Log();
 * log.print('info', context, "Info Message");
 */
async function print(
  level: LogType,
  data: GraphQLRequestContext<BaseContext>,
  message?: string
) {
  if (data.operationName === 'IntrospectionQuery') return;

  const operationInfo = `${data.operation?.name?.value || 'unknown'} ${
    data.operation?.operation ?? ''
  }`;
  const text = `${message ? '- ' + message : ''}`;
  const timestamp =
    '[' + new Date().toISOString().split('T').join(' ').slice(0, -5) + ']';
  const errors = data.errors
    ? `\nErrors: \n${data.errors.map((error) => error.message).join('\n')}`
    : '';

  console.log(
    chalk[logColors.get(level) as ColorName](
      `${operationInfo} ${text} ${level} ${timestamp} ${errors}`
    )
  );
}

/**
 * Create a Logger
 *
 * Logs colorful messages to the console
 *
 * @example
 * const log = makeLog("info", "error", "success");
 * log.error(context, "Error Message");
 * log.success(context, "Success Message");
 * log.info(context, "Info Message");
 */
const makeLog = <T extends LogType[]>(...types: T) =>
  Object.fromEntries(
    types.map((type) => [
      type,
      (context: GraphQLRequestContext<BaseContext>, message?: string) =>
        print(type, context, message)
    ])
  ) as unknown as Record<
    T[number],
    (
      context: GraphQLRequestContext<BaseContext>,
      message?: string
    ) => Promise<void>
  >;

type Log = ReturnType<typeof makeLog>;

/**
 * Apollo Logging Plugin
 *
 * Logs GraphQL operations to the console
 *
 * @example
 * // Basic usage
 * import { ApolloLogPlugin } from 'apollo-logging-plugin';
 *
 * const server = new ApolloServer({
 *   schema,
 *   plugins: [ApolloLogPlugin()],
 * });
 *
 * @example
 * // With custom handlers
 * import { ApolloLogPlugin } from 'apollo-logging-plugin';
 *
 * const handlers = (log: Log) => ({
 *   didEncounterErrors: log.error,
 *   didResolveOperation: log.info,
 *   didEncounterSubsequentErrors: (context) => log.error(context, 'Custom Message),
 *   parsingDidStart: (context) => {
 *    // handle event
 *   },
 *   // ... other handlers
 * });
 *
 * const server = new ApolloServer({
 *   typeDefs,
 *   resolvers,
 *   plugins: [ApolloLogPlugin(handlers)],
 * });
 *
 */
export const ApolloLogPlugin = (
  handlers?: (log: Log) => GraphQLRequestListener<BaseContext>
): ApolloServerPlugin => {
  const log = makeLog('info', 'error', 'success');

  const baseHandlers: GraphQLRequestListener<BaseContext> = {};

  baseHandlers['didEncounterErrors'] = log.error;
  baseHandlers['didResolveOperation'] = log.success;

  return {
    async requestDidStart() {
      return {
        ...baseHandlers,
        ...handlers?.(log)
      };
    }
  };
};
