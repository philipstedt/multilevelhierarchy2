import React from 'react';
import { Box, VStack, HStack, Text, Button, Badge, Heading, Stack, Switch, IconButton } from '@chakra-ui/react';
import { Plus, X, Settings, Eye, EyeOff } from 'lucide-react';

const fieldTypeIcons = {
  text: '📝',
  email: '📧',
  phone: '📞',
  status: '🏷️',
  date: '📅',
  number: '🔢',
  dropdown: '📋',
  location: '📍',
  long_text: '📄',
  link: '🔗',
  people: '👥'
};

export const FieldConfigurator = ({ level, availableFields, selectedFields, onFieldsChange }) => {
  const selectedKeys = selectedFields.map(f => f.key);
  const unselectedFields = availableFields.filter(f => !selectedKeys.includes(f.key));

  const addField = (field) => {
    onFieldsChange([...selectedFields, { ...field, readOnly: false }]);
  };

  const removeField = (fieldKey) => {
    onFieldsChange(selectedFields.filter(f => f.key !== fieldKey));
  };

  const toggleReadOnly = (fieldKey) => {
    onFieldsChange(selectedFields.map(f => 
      f.key === fieldKey ? { ...f, readOnly: !f.readOnly } : f
    ));
  };

  const getLevelColor = () => {
    if (level === 0) return 'blue';
    if (level === 1) return 'purple';
    return 'teal';
  };

  const getLevelName = () => {
    if (level === 0) return 'Company';
    if (level === 1) return 'Location';
    return 'Subscription';
  };

  return (
    <VStack align="stretch" gap={4}>
      <Box>
        <Heading size="sm" color="fg" mb={2}>
          {getLevelName()} Fields
        </Heading>
        <Text fontSize="xs" color="fg.muted">
          Select which fields to show and edit for {getLevelName()} items
        </Text>
      </Box>

      <Box>
        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2} textTransform="uppercase">
          Selected Fields ({selectedFields.length})
        </Text>
        <Stack gap={2}>
          {selectedFields.length === 0 ? (
            <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
              <Text fontSize="sm" color="gray.500">No fields selected</Text>
            </Box>
          ) : (
            selectedFields.map(field => (
              <HStack
                key={field.key}
                p={2}
                bg={`${getLevelColor()}.50`}
                borderRadius="md"
                justify="space-between"
              >
                <HStack gap={2} flex={1}>
                  <Text fontSize="sm">{fieldTypeIcons[field.type]}</Text>
                  <Text fontSize="sm" fontWeight="500">{field.label}</Text>
                  {field.required && <Badge size="xs" colorPalette="red">Required</Badge>}
                  {field.readOnly && <Badge size="xs" colorPalette="gray">Read-only</Badge>}
                </HStack>
                <HStack gap={1}>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    colorPalette={field.readOnly ? 'gray' : 'blue'}
                    onClick={() => toggleReadOnly(field.key)}
                    title={field.readOnly ? 'Make editable' : 'Make read-only'}
                  >
                    {field.readOnly ? <EyeOff size={14} /> : <Eye size={14} />}
                  </IconButton>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => removeField(field.key)}
                  >
                    <X size={14} />
                  </Button>
                </HStack>
              </HStack>
            ))
          )}
        </Stack>
      </Box>

      <Box>
        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2} textTransform="uppercase">
          Available Fields
        </Text>
        <Stack gap={2} maxH="300px" overflowY="auto">
          {unselectedFields.map(field => (
            <HStack
              key={field.key}
              p={2}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              justify="space-between"
              cursor="pointer"
              _hover={{ bg: 'gray.50', borderColor: `${getLevelColor()}.300` }}
              onClick={() => addField(field)}
            >
              <HStack gap={2}>
                <Text fontSize="sm">{fieldTypeIcons[field.type]}</Text>
                <Text fontSize="sm">{field.label}</Text>
              </HStack>
              <Plus size={14} color="var(--chakra-colors-gray-400)" />
            </HStack>
          ))}
        </Stack>
      </Box>
    </VStack>
  );
};
