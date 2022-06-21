import $RefParser from '@apidevtools/json-schema-ref-parser';
import _ from 'lodash';

import { ParseNode, ParseSchema, Struct } from './node-types';

export * from './parse-schema';
export * from './node-types';
export * from './rust-repr';

const reformatDefinitions = (definitions: {
  [d: string]: { [d: string]: any } // eslint-disable-line  @typescript-eslint/no-explicit-any
}): any => { // eslint-disable-line  @typescript-eslint/no-explicit-any
  if (definitions === undefined) {
    return undefined;
  }

  return _.mapValues(definitions, (v, k) => ({
    ...v,
    ref: k
  }));
};

export const parseSchema = async (
  schema: any // eslint-disable-line  @typescript-eslint/no-explicit-any
): Promise<ParseNode> => {
  return _parse(
    (await $RefParser.dereference({
      ...schema,
      definitions: reformatDefinitions(schema.definitions)
    })) as any // eslint-disable-line  @typescript-eslint/no-explicit-any
  );
};

export default parseSchema;

export const _parse = (schema: ParseSchema): ParseNode => { // eslint-disable-line  sonarjs/cognitive-complexity
  const { title, description, ref } = schema;

  // if ('allOf' in schema) {
  //   return _parse(schema.allOf[0]);
  // }

  if ('oneOf' in schema) {
    const variants: ParseNode[] = [];
    schema.oneOf.forEach(v => {
      variants.push(_parse(v));
    });

    if (
      variants.length === 2 &&
      variants.findIndex(v => v.type === 'none') !== -1
    ) {
      return {
        ref,
        type: 'optional',
        value: {
          title,
          description,
          body: variants[0]
        }
      };
    }

    return {
      ref,
      type: 'enum',
      value: {
        title,
        description,
        variants: variants as Array<Struct.Node<{ [m: string]: ParseNode }>>
      }
    };
  }

  if (schema.type === 'null') {
    return {
      ref,
      type: 'none',
      value: {
        title,
        description
      }
    };
  }

  if (schema.type === 'string') {
    return {
      ref,
      type: 'string',
      value: {
        title,
        description
      }
    };
  }

  if (schema.type === 'boolean') {
    return {
      ref,
      type: 'boolean',
      value: {
        title,
        description
      }
    };
  }

  if (schema.type === 'integer') {
    return {
      ref,
      type: 'integer',
      value: {
        title,
        description,
        size: schema.format === 'uint64' ? 'u64' : 'u32'
      }
    };
  }

  if (schema.type === 'object') {
    const members: Struct.Node<any>['value']['members'] = {}; // eslint-disable-line  @typescript-eslint/no-explicit-any
    Object.entries(schema.properties || {}).forEach(
      ([memberName, memberSchema]) => {
        members[memberName] = _parse(memberSchema);
      }
    );
    return {
      ref,
      type: 'struct',
      value: {
        title,
        description,
        members
      }
    };
  }

  if (schema.type === 'array') {
    if (Array.isArray(schema.items)) {
      const contents = schema.items.map(x => _parse(x));
      return {
        ref,
        type: 'tuple',
        value: {
          title,
          description,
          contents
        }
      };
    } else {
      if (
        schema.maxItems !== undefined &&
        schema.minItems !== undefined &&
        schema.maxItems === schema.minItems
      ) {
        return {
          ref,
          type: 'array',
          value: {
            title,
            description,
            contents: _parse(schema.items),
            size: schema.maxItems
          }
        };
      }
      return {
        ref,
        type: 'vec',
        value: {
          title,
          description,
          contents: _parse(schema.items)
        }
      };
    }
  }

  if (Array.isArray(schema.type) && schema.type.includes('null')) {
    const newSchema: any = { // eslint-disable-line  @typescript-eslint/no-explicit-any
      ...schema,
      type: schema.type[0]
    };
    return {
      ref,
      type: 'optional',
      value: {
        title,
        description,
        body: _parse(newSchema)
      }
    };
  }

  throw new Error(`could not parse schema: ${JSON.stringify(schema, null, 2)}`);
};
