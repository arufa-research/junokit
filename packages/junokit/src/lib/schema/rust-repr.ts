import { Enum, ParseNode, ParseSchema, RustStructNode } from './node-types';
import { parseSchema } from './parse-schema';

export type ExecuteMsgNode = Enum.Node<RustStructNode[]>;
export type InstantiateMsg = RustStructNode;

export const parseExecuteMsg = async (schema: ParseSchema): Promise<any> => {
  const tree = (await parseSchema(schema)) as ExecuteMsgNode;

  // walk the tree
  tree.value.variants.forEach(v => {
    Object.entries(v.value.members).forEach(([fnName, fnBody]) => {
      console.log(fnName);
      Object.entries(fnBody.value.members).forEach(([argName, argBody]) => {
        console.log('\t' + argName + ': ' + rustRepr(argBody));
      });
    });
  });
};

export const rustRepr = (arg: ParseNode): string => {
  if (arg.ref !== undefined) {
    return arg.ref;
  }
  switch (arg.type) {
    case 'boolean':
      return 'Boolean';
    case 'integer':
      return 'Number';
    case 'string':
      return 'String';
    case 'array':
      return `[${rustRepr(arg.value.contents)}; ${arg.value.size}]`;
    case 'tuple':
      return '(' + arg.value.contents.map(rustRepr).join(', ') + ')';
    case 'vec':
      return 'Vec<' + rustRepr(arg.value.contents) + '>';
    case 'optional':
      return 'Optional<' + rustRepr(arg.value.body) + '>';
    case 'enum':
      return '(' + arg.value.variants.map(rustRepr).join(' | ') + ')';
    case 'struct':
      return (
        '{' +
        Object.entries(arg.value.members)
          .map(([mName, mBody]) => `${mName}: ${rustRepr(mBody)}`)
          .join(', ') +
        '}'
      );
  }
  throw new Error(
    `could not determine rust representation for: ${JSON.stringify(arg)}`
  );
};
