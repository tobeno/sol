import type $RefParser from '@apidevtools/json-schema-ref-parser';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

type $Refs = InstanceType<typeof $RefParser>['$refs'];

function dereferenceJsonSchemaUsingRefs(schema: any, $refs: $Refs) {
  if (!schema || typeof schema !== 'object') {
    return;
  }

  const resolveRef = (refSchema: any) => {
    let dereferencedSchema = $refs.get(refSchema.$ref);

    if (dereferencedSchema && typeof dereferencedSchema === 'object') {
      // Store original reference
      dereferencedSchema = {
        'x-ref': refSchema.$ref,
        ...dereferencedSchema,
      } as any;
    }

    return dereferencedSchema;
  };

  if (Array.isArray(schema)) {
    schema.forEach((value, index) => {
      if (value && typeof value === 'object') {
        if (value.$ref) {
          schema[index] = resolveRef(value);
        } else {
          dereferenceJsonSchemaUsingRefs(value, $refs);
        }
      }
    });

    return;
  }

  Object.entries(schema).forEach(([key, value]: [string, any]) => {
    if (value && typeof value === 'object') {
      if (value.$ref) {
        schema[key] = resolveRef(value);
      } else {
        dereferenceJsonSchemaUsingRefs(value, $refs);
      }
    }
  }, {} as any);
}

/**
 * Inlines all $ref references in a JSON schema
 *
 * Note: The original ref is preserved as x-ref field
 */
export async function dereferenceJsonSchema<SchemaType = any>(
  schema: SchemaType,
): Promise<SchemaType> {
  // Lazy load for performance
  // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
  const $RefParser = require('@apidevtools/json-schema-ref-parser');

  const $refs = await $RefParser.resolve(schema);

  dereferenceJsonSchemaUsingRefs(schema, $refs);

  return schema;
}
