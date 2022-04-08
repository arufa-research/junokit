/* eslint-disable @typescript-eslint/no-namespace */

export interface Descriptors {
  title?: string
  description?: string
}

export type SimpleNodeType = 'none' | 'boolean' | 'string' | 'integer';

export type CompositeNodeType =
  | 'enum'
  | 'struct'
  | 'optional'
  | 'array'
  | 'vec'
  | 'tuple';

export type NodeType = SimpleNodeType | CompositeNodeType;

export type ParseSchema =
  | None.Schema
  | Boolean.Schema
  | Integer.Schema
  | Str.Schema
  | Enum.Schema
  | Optional.Schema
  | Struct.Schema
  | Array.Schema
  | Tuple.Schema
  | Vec.Schema;

export type ParseNode =
  | None.Node
  | Boolean.Node
  | Integer.Node
  | Str.Node
  | Enum.Node<Array<Struct.Node<{ [m: string]: ParseNode }>>>
  | Optional.Node<ParseNode>
  | Struct.Node<{ [m: string]: ParseNode }>
  | Array.Node<ParseNode>
  | Tuple.Node<ParseNode[]>
  | Vec.Node<ParseNode>;

export type SchemaDef<T> = {
  title?: string
  description?: string
  ref?: string
} & T;

export type NodeValue<T> = {
  title?: string
  description?: string
} & T;

export interface NodeDef<T extends NodeType, V = Record<string, never>> {
  type: T
  value: NodeValue<V>
  ref?: string
}

// Simple Nodes

export namespace None {
  export type Schema = SchemaDef<{
    type: 'null'
  }>;

  export type Node = NodeDef<'none'>;
}

export namespace Str {
  export type Schema = SchemaDef<{
    type: 'string'
  }>;

  export type Node = NodeDef<'string'>;
}

export namespace Integer {
  export type Schema = SchemaDef<{
    type: 'integer'
    format?: string
  }>;

  export type Node = NodeDef<'integer', { size: string }>;
}

export namespace Boolean {
  export type Schema = SchemaDef<{
    type: 'boolean'
  }>;

  export type Node = NodeDef<'boolean'>;
}

// Composite Nodes
export namespace Enum {
  export type Schema = SchemaDef<{
    oneOf: ParseSchema[]
  }>;

  export interface Node<T extends Array<Struct.Node<{ [m: string]: ParseNode }>>> {
    type: 'enum'
    value: NodeValue<{
      variants: T
    }>
    ref?: string
  }
}

export namespace Optional {
  export type Schema = SchemaDef<{
    type: any[]
  }>;

  export interface Node<T extends ParseNode> {
    type: 'optional'
    value: NodeValue<{
      body: T
    }>
    ref?: string
  }
}
export namespace Struct {
  export type Schema = SchemaDef<{
    type: 'object'
    properties: {
      [memberName: string]: ParseSchema
    }
  }>;

  export interface Node<T extends Record<string, ParseNode>> {
    type: 'struct'
    value: NodeValue<{
      members: T
    }>
    ref?: string
  }
}

export namespace Array {
  export type Schema = SchemaDef<{
    type: 'array'
    items: ParseSchema
    minItems: number
    maxItems: number
  }>;

  export interface Node<T extends ParseNode> {
    type: 'array'
    value: NodeValue<{
      contents: T
      size: number
    }>
    ref?: string
  }
}

export namespace Tuple {
  export type Schema = SchemaDef<{
    type: 'array'
    items: ParseSchema[]
    minItems: undefined
    maxItems: undefined
  }>;

  export interface Node<T extends ParseNode[]> {
    type: 'tuple'
    value: NodeValue<{
      contents: T
    }>
    ref?: string
  }
}
export namespace Vec {
  export type Schema = SchemaDef<{
    type: 'array'
    items: ParseSchema
    minItems: undefined
    maxItems: undefined
  }>;

  export interface Node<T extends ParseNode> {
    type: 'vec'
    value: NodeValue<{
      contents: T
    }>
    ref?: string
  }
}

// rust types..

export type RustStructNode = Struct.Node<{
  [m: string]: Struct.Node<{ [m: string]: ParseNode }>
}>;
