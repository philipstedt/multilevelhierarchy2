import React from 'react';
import { Box, Field, Input, Badge, HStack, VStack, Text, Accordion, Stack, Select, Portal, createListCollection, Textarea } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';

const statusOptions = createListCollection({
  items: [
    { label: 'Skickad', value: 'Skickad' },
    { label: 'Signerad', value: 'Signerad' },
    { label: 'Öppnad', value: 'Öppnad' }
  ]
});

const intervallOptions = createListCollection({
  items: [
    { label: 'Kvartalsfakturering', value: 'Kvartalsfakturering' },
    { label: 'Månadsfakturering', value: 'Månadsfakturering' },
    { label: 'Årsfakturering', value: 'Årsfakturering' }
  ]
});

const rLocationOptions = createListCollection({
  items: [
    { label: 'Jobbar på det', value: 'Jobbar på det' },
    { label: 'Ja', value: 'Ja' },
    { label: 'Nej', value: 'Nej' }
  ]
});

const valutaOptions = createListCollection({
  items: [
    { label: 'EUR', value: 'EUR' },
    { label: 'SEK', value: 'SEK' },
    { label: 'NOK', value: 'NOK' }
  ]
});

const typAvAffrOptions = createListCollection({
  items: [
    { label: 'Merförsäljning', value: 'Merförsäljning' },
    { label: 'Winback', value: 'Winback' },
    { label: 'Förlängning', value: 'Förlängning' },
    { label: 'Ny kund', value: 'Ny kund' },
    { label: 'Uppgradering', value: 'Uppgradering' },
    { label: 'Nedgradering', value: 'Nedgradering' },
    { label: 'Befintlig Kund', value: 'Befintlig Kund' }
  ]
});

const branschOptions = createListCollection({
  items: [
    { label: 'Restaurang', value: 'Restaurang' },
    { label: 'Bil / Bilvård', value: 'Bil / Bilvård' },
    { label: 'Butik', value: 'Butik' },
    { label: 'Hälsovård', value: 'Hälsovård' },
    { label: 'Skönhet', value: 'Skönhet' },
    { label: 'Frisör', value: 'Frisör' },
    { label: 'Övrigt', value: 'Övrigt' }
  ]
});

const getLevelColor = (level) => {
  if (level === 0) return 'blue';
  if (level === 1) return 'purple';
  return 'teal';
};

const getLevelLabel = (level) => {
  if (level === 0) return 'L0';
  if (level === 1) return 'L1';
  return 'L2';
};

export const LevelSection = ({ 
  level, 
  title, 
  fields, 
  onChange, 
  validationErrors = {}, 
  children,
  value
}) => {
  const indent = level * 24;

  return (
    <Box
      ml={`${indent}px`}
      p={4}
      bg={level === 0 ? 'white' : 'bg.subtle'}
      borderLeft={level > 0 ? '3px solid' : 'none'}
      borderColor={`${getLevelColor(level)}.400`}
      borderRadius="lg"
      mb={3}
    >
      <HStack mb={4} justify="space-between">
        <HStack gap={2}>
          <Badge colorPalette={getLevelColor(level)} size="sm">
            {getLevelLabel(level)}
          </Badge>
          <Text fontWeight="600" color="fg">
            {title}
          </Text>
        </HStack>
      </HStack>

      <Stack gap={4}>
        {fields.map((field) => (
          <Field.Root key={field.key} invalid={!!validationErrors[field.key]}>
            <Field.Label fontSize="sm" fontWeight="600" color="gray.700">
              {field.label}
              {field.required && <Text as="span" color="fg.error" ml={1}>*</Text>}
            </Field.Label>
            
            {field.type === 'text' && (
              <Input
                value={value?.[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                bg={field.readOnly ? 'gray.100' : 'white'}
                borderColor={validationErrors[field.key] ? 'border.error' : 'border.muted'}
                disabled={field.readOnly}
                cursor={field.readOnly ? 'not-allowed' : 'text'}
              />
            )}

            {field.type === 'status' && (() => {
              let options = statusOptions;
              if (field.key === 'intervall') options = intervallOptions;
              else if (field.key === 'rLocation') options = rLocationOptions;
              
              return (
                <Select.Root
                  collection={options}
                  value={value?.[field.key] ? [value[field.key]] : []}
                  onValueChange={(e) => onChange(field.key, e.value[0])}
                  disabled={field.readOnly}
                >
                  <Select.Control bg={field.readOnly ? 'gray.100' : 'white'}>
                    <Select.Trigger cursor={field.readOnly ? 'not-allowed' : 'pointer'}>
                      <Select.ValueText placeholder="Select status" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {options.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              );
            })()}

            {field.type === 'email' && (
              <Input
                type="email"
                value={value?.[field.key]?.email || value?.[field.key] || ''}
                onChange={(e) => onChange(field.key, { email: e.target.value, label: e.target.value })}
                placeholder={field.placeholder}
                bg={field.readOnly ? 'gray.100' : 'white'}
                borderColor={validationErrors[field.key] ? 'border.error' : 'border.muted'}
                disabled={field.readOnly}
                cursor={field.readOnly ? 'not-allowed' : 'text'}
              />
            )}

            {field.type === 'phone' && (
              <Input
                type="tel"
                value={value?.[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                bg={field.readOnly ? 'gray.100' : 'white'}
                borderColor={validationErrors[field.key] ? 'border.error' : 'border.muted'}
                disabled={field.readOnly}
                cursor={field.readOnly ? 'not-allowed' : 'text'}
              />
            )}

            {field.type === 'date' && (
              <Input
                type="date"
                value={value?.[field.key] ? new Date(value[field.key]).toISOString().split('T')[0] : ''}
                onChange={(e) => onChange(field.key, e.target.value ? new Date(e.target.value) : null)}
                bg={field.readOnly ? 'gray.100' : 'white'}
                borderColor={validationErrors[field.key] ? 'border.error' : 'border.muted'}
                disabled={field.readOnly}
                cursor={field.readOnly ? 'not-allowed' : 'text'}
              />
            )}

            {field.type === 'number' && (
              <Input
                type="number"
                value={value?.[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value ? parseFloat(e.target.value) : null)}
                placeholder={field.placeholder}
                bg={field.readOnly ? 'gray.100' : 'white'}
                borderColor={validationErrors[field.key] ? 'border.error' : 'border.muted'}
                disabled={field.readOnly}
                cursor={field.readOnly ? 'not-allowed' : 'text'}
              />
            )}

            {field.type === 'link' && (
              <Input
                type="url"
                value={value?.[field.key]?.url || value?.[field.key] || ''}
                onChange={(e) => onChange(field.key, { url: e.target.value, label: e.target.value })}
                placeholder={field.placeholder}
                bg={field.readOnly ? 'gray.100' : 'white'}
                borderColor={validationErrors[field.key] ? 'border.error' : 'border.muted'}
                disabled={field.readOnly}
                cursor={field.readOnly ? 'not-allowed' : 'text'}
              />
            )}

            {field.type === 'long_text' && (
              <Textarea
                value={value?.[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                bg={field.readOnly ? 'gray.100' : 'white'}
                borderColor={validationErrors[field.key] ? 'border.error' : 'border.muted'}
                disabled={field.readOnly}
                cursor={field.readOnly ? 'not-allowed' : 'text'}
              />
            )}

            {field.type === 'location' && (
              <Input
                value={value?.[field.key]?.address || value?.[field.key]?.city || ''}
                onChange={(e) => onChange(field.key, { address: e.target.value })}
                placeholder="Enter address"
                bg={field.readOnly ? 'gray.100' : 'white'}
                borderColor={validationErrors[field.key] ? 'border.error' : 'border.muted'}
                disabled={field.readOnly}
                cursor={field.readOnly ? 'not-allowed' : 'text'}
              />
            )}

            {field.type === 'people' && (
              <Input
                value={value?.[field.key]?.map(p => p.name).join(', ') || ''}
                placeholder="People (read-only)"
                bg="gray.100"
                borderColor="border.muted"
                disabled
                cursor="not-allowed"
              />
            )}

            {field.type === 'dropdown' && (() => {
              let options = [];
              if (field.key === 'valuta') options = valutaOptions;
              else if (field.key === 'typAvAffr') options = typAvAffrOptions;
              else if (field.key === 'bransch') options = branschOptions;
              
              return (
                <Select.Root
                  collection={options}
                  value={value?.[field.key] ? [value[field.key]] : []}
                  onValueChange={(e) => onChange(field.key, e.value[0])}
                  disabled={field.readOnly}
                >
                  <Select.Control bg={field.readOnly ? 'gray.100' : 'white'}>
                    <Select.Trigger cursor={field.readOnly ? 'not-allowed' : 'pointer'}>
                      <Select.ValueText placeholder="Select..." />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {options.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              );
            })()}

            {validationErrors[field.key] && (
              <Field.ErrorText fontSize="sm">
                {validationErrors[field.key]}
              </Field.ErrorText>
            )}
          </Field.Root>
        ))}
      </Stack>

      {children && (
        <Box mt={4}>
          {children}
        </Box>
      )}
    </Box>
  );
};
