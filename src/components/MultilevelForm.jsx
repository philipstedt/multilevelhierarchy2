import React, { useState } from 'react';
import { Box, Button, VStack, HStack, Heading, Alert, Select, Portal, createListCollection, Spinner, Text, Accordion, Stack, Drawer, IconButton } from '@chakra-ui/react';
import { Plus, Save, ChevronDown, Settings, X } from 'lucide-react';
import { LevelSection } from './LevelSection';
import { useMultilevelData } from '../hooks/useMultilevelData';
import { FieldConfigurator } from './FieldConfigurator';

const allAvailableFields = [
  { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name', readOnly: false },
  { key: 'orderformulr', label: 'Orderformulär', type: 'link', required: false, placeholder: 'Enter URL', readOnly: false },
  { key: 'sljare', label: 'Säljare', type: 'people', required: false, readOnly: false },
  { key: 'statusOffert', label: 'Status Offert', type: 'status', required: false, readOnly: false },
  { key: 'orgnummer', label: 'Orgnummer', type: 'text', required: false, placeholder: 'Enter org number', readOnly: false },
  { key: 'frnamn', label: 'Förnamn', type: 'text', required: false, placeholder: 'Enter first name', readOnly: false },
  { key: 'efternamn', label: 'Efternamn', type: 'text', required: false, placeholder: 'Enter last name', readOnly: false },
  { key: 'email', label: 'Email', type: 'email', required: false, placeholder: 'email@example.com', readOnly: false },
  { key: 'telefonnummer', label: 'Telefonnummer', type: 'phone', required: false, placeholder: '+46...', readOnly: false },
  { key: 'documentId', label: 'Document ID', type: 'text', required: false, placeholder: 'DOC-...', readOnly: false },
  { key: 'skickatDatum', label: 'Skickat Datum', type: 'date', required: false, readOnly: false },
  { key: 'signeradDatum', label: 'Signerad Datum', type: 'date', required: false, readOnly: false },
  { key: 'faktureringsmejl', label: 'Faktureringsmejl', type: 'email', required: false, placeholder: 'email@example.com', readOnly: false },
  { key: 'adress', label: 'Adress', type: 'location', required: false, readOnly: false },
  { key: 'intervall', label: 'Intervall', type: 'status', required: false, readOnly: false },
  { key: 'valuta', label: 'Valuta', type: 'dropdown', required: false, readOnly: false },
  { key: 'typAvAffr', label: 'Typ av affär', type: 'dropdown', required: false, readOnly: false },
  { key: 'bransch', label: 'Bransch', type: 'dropdown', required: false, readOnly: false },
  { key: 'frnamnKontaktperson', label: 'Förnamn kontaktperson', type: 'text', required: false, placeholder: 'Enter first name', readOnly: false },
  { key: 'efternamnKontaktperson', label: 'Efternamn kontaktperson', type: 'text', required: false, placeholder: 'Enter last name', readOnly: false },
  { key: 'emailKontaktperson', label: 'Email Kontaktperson', type: 'email', required: false, placeholder: 'email@example.com', readOnly: false },
  { key: 'telefonnummerKontaktperson', label: 'Telefonnummer kontaktperson', type: 'phone', required: false, placeholder: '+46...', readOnly: false },
  { key: 'artikelnummer', label: 'Artikelnummer', type: 'text', required: false, placeholder: 'ART-...', readOnly: false },
  { key: 'pris', label: 'Pris', type: 'number', required: false, placeholder: '0.00', readOnly: false },
  { key: 'bindningstid', label: 'Bindningstid', type: 'number', required: false, placeholder: 'Months', readOnly: false },
  { key: 'frfallodatum', label: 'Förfallodatum', type: 'date', required: false, readOnly: false },
  { key: 'moms', label: 'Moms', type: 'number', required: false, placeholder: '25', readOnly: false },
  { key: 'rabatt', label: 'Rabatt', type: 'number', required: false, placeholder: '0', readOnly: false },
  { key: 'startdatumAbonnemang', label: 'Startdatum Abonnemang', type: 'date', required: false, readOnly: false },
  { key: 'orderkommentar', label: 'Orderkommentar', type: 'long_text', required: false, placeholder: 'Enter notes...', readOnly: false },
  { key: 'rLocation', label: 'Är Location?', type: 'status', required: false, readOnly: false },
  { key: 'tillhr', label: 'Tillhör', type: 'text', required: false, placeholder: 'Enter value', readOnly: false }
];

const defaultLevel0Fields = [
  { key: 'orgnummer', label: 'Orgnummer', type: 'text', required: false, placeholder: 'Enter org number', readOnly: false },
  { key: 'frnamn', label: 'Förnamn', type: 'text', required: false, placeholder: 'Enter first name', readOnly: false },
  { key: 'efternamn', label: 'Efternamn', type: 'text', required: false, placeholder: 'Enter last name', readOnly: false }
];

const defaultLevel1Fields = [
  { key: 'name', label: 'Location Name', type: 'text', required: true, placeholder: 'Enter location name', readOnly: false },
  { key: 'statusOffert', label: 'Status Offert', type: 'status', required: true, readOnly: false }
];

const defaultLevel2Fields = [
  { key: 'name', label: 'Subscription Name', type: 'text', required: true, placeholder: 'Enter subscription name', readOnly: false }
];

export const MultilevelForm = () => {
  const { level0Items, loading, error, fetchItemWithSubitems, updateSubitem, updateLevel0Item } = useMultilevelData();
  const [selectedLevel0, setSelectedLevel0] = useState(null);
  const [level0Data, setLevel0Data] = useState({});
  const [level1Sections, setLevel1Sections] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loadingSubitems, setLoadingSubitems] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [level0Fields, setLevel0Fields] = useState(defaultLevel0Fields);
  const [level1Fields, setLevel1Fields] = useState(defaultLevel1Fields);
  const [level2Fields, setLevel2Fields] = useState(defaultLevel2Fields);

  const level0Collection = createListCollection({
    items: level0Items.map(item => ({ label: item.name, value: item.id }))
  });

  const handleLevel0Change = async (itemId) => {
    setSelectedLevel0(itemId);
    setLevel0Data({});
    setLevel1Sections([]);
    setValidationErrors({});
    
    if (!itemId) return;

    setLoadingSubitems(true);
    try {
      const itemWithSubitems = await fetchItemWithSubitems(itemId, getAllConfiguredColumns());
      
      // Populate Level 0 data
      const l0Data = { name: itemWithSubitems.name };
      level0Fields.forEach(field => {
        if (itemWithSubitems[field.key] !== undefined) {
          l0Data[field.key] = itemWithSubitems[field.key];
        }
      });
      setLevel0Data(l0Data);
      
      // Transform existing subitems into form structure with all configured fields
      const sections = (itemWithSubitems.subitems || []).map(subitem => {
        const l1Data = { name: subitem.name };
        level1Fields.forEach(field => {
          if (subitem[field.key] !== undefined) {
            l1Data[field.key] = subitem[field.key];
          }
        });

        return {
          id: subitem.id,
          data: l1Data,
          level2Sections: (subitem.subitems || []).map(subSubitem => {
            const l2Data = { name: subSubitem.name };
            level2Fields.forEach(field => {
              if (subSubitem[field.key] !== undefined) {
                l2Data[field.key] = subSubitem[field.key];
              }
            });
            return { id: subSubitem.id, data: l2Data };
          })
        };
      });
      
      setLevel1Sections(sections);
    } catch (err) {
      console.error('Failed to load subitems:', err);
      setSubmitError('Failed to load existing data');
    } finally {
      setLoadingSubitems(false);
    }
  };

  const updateLevel0Data = (field, value) => {
    setLevel0Data({ ...level0Data, [field]: value });
  };

  const updateLevel1Data = (level1Id, field, value) => {
    setLevel1Sections(level1Sections.map(l1 =>
      l1.id === level1Id ? { ...l1, data: { ...l1.data, [field]: value } } : l1
    ));
  };

  const updateLevel2Data = (level1Id, level2Id, field, value) => {
    setLevel1Sections(level1Sections.map(l1 =>
      l1.id === level1Id
        ? {
            ...l1,
            level2Sections: l1.level2Sections.map(l2 =>
              l2.id === level2Id ? { ...l2, data: { ...l2.data, [field]: value } } : l2
            )
          }
        : l1
    ));
  };

  const validate = () => {
    const errors = {};
    if (!selectedLevel0) {
      errors.level0 = 'Please select a Level 0 item';
    }
    
    level1Sections.forEach((l1, idx) => {
      if (!l1.data.name) errors[`l1_${idx}_name`] = 'Name is required';
      if (!l1.data.statusOffert) errors[`l1_${idx}_status`] = 'Status is required';
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const prevSections = level1Sections;
    const prevLevel0 = level0Data;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Update Level 0 item
      const l0Columns = {};
      level0Fields.forEach(field => {
        if (field.key !== 'name' && level0Data[field.key] !== undefined) {
          l0Columns[field.key] = level0Data[field.key];
        }
      });

      await updateLevel0Item(selectedLevel0, {
        name: level0Data.name,
        columns: l0Columns
      });

      // Update all Level 1 subitems
      for (const l1Section of level1Sections) {
        const l1Columns = {};
        level1Fields.forEach(field => {
          if (field.key !== 'name' && l1Section.data[field.key] !== undefined) {
            l1Columns[field.key] = l1Section.data[field.key];
          }
        });

        await updateSubitem(selectedLevel0, l1Section.id, {
          name: l1Section.data.name,
          columns: l1Columns
        });

        // Update all Level 2 sub-subitems
        for (const l2Section of l1Section.level2Sections) {
          const l2Columns = {};
          level2Fields.forEach(field => {
            if (field.key !== 'name' && l2Section.data[field.key] !== undefined) {
              l2Columns[field.key] = l2Section.data[field.key];
            }
          });

          await updateSubitem(l1Section.id, l2Section.id, {
            name: l2Section.data.name,
            columns: l2Columns
          });
        }
      }

      // Reload data after successful update
      await handleLevel0Change(selectedLevel0);
      setValidationErrors({});
    } catch (err) {
      setLevel1Sections(prevSections);
      setLevel0Data(prevLevel0);
      setSubmitError('Failed to save changes. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box p={8} display="flex" justifyContent="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  const getAllConfiguredColumns = () => {
    const allFields = [...level0Fields, ...level1Fields, ...level2Fields];
    const uniqueKeys = [...new Set(allFields.map(f => f.key))];
    return uniqueKeys.filter(key => key !== 'name');
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack align="stretch" gap={6} maxW="1200px" mx="auto">
        <HStack justify="space-between">
          <Heading size="lg" color="fg">Multi-Level Form</Heading>
          <Button
            leftIcon={<Settings size={18} />}
            variant="outline"
            onClick={() => setShowConfig(true)}
            size="sm"
          >
            Configure Fields
          </Button>
        </HStack>

        {error && (
          <Alert.Root colorPalette="red">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}

        {submitError && (
          <Alert.Root colorPalette="red">
            <Alert.Title>Submission Error</Alert.Title>
            <Alert.Description>{submitError}</Alert.Description>
          </Alert.Root>
        )}

        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
            Select Company <Text as="span" color="fg.error">*</Text>
          </Text>
          <Select.Root
            collection={level0Collection}
            value={selectedLevel0 ? [selectedLevel0] : []}
            onValueChange={(e) => handleLevel0Change(e.value[0])}
          >
            <Select.Control bg="white">
              <Select.Trigger>
                <Select.ValueText placeholder="Search and select..." />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content maxH="300px" overflowY="auto">
                  {level0Collection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          {validationErrors.level0 && (
            <Text fontSize="sm" color="fg.error" mt={2}>{validationErrors.level0}</Text>
          )}
        </Box>

        {loadingSubitems && (
          <Box display="flex" justifyContent="center" p={4}>
            <Spinner size="md" />
          </Box>
        )}

        {selectedLevel0 && !loadingSubitems && level1Sections.length === 0 && (
          <Alert.Root colorPalette="blue">
            <Alert.Indicator />
            <Alert.Title>No Locations Found</Alert.Title>
            <Alert.Description>This company doesn't have any locations yet.</Alert.Description>
          </Alert.Root>
        )}

        {selectedLevel0 && !loadingSubitems && (
          <>
            {/* Company Fields */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" border="2px solid" borderColor="blue.200">
              <LevelSection
                level={0}
                title={level0Data.name || 'Company'}
                fields={level0Fields}
                value={level0Data}
                onChange={updateLevel0Data}
                validationErrors={{}}
              />
            </Box>

            {level1Sections.length > 0 && (
              <>
                <Accordion.Root multiple>
              {level1Sections.map((l1, idx) => (
                <Accordion.Item key={l1.id} value={l1.id.toString()}>
                  <Box bg="white" borderRadius="lg" mb={3} boxShadow="sm">
                    <Accordion.ItemTrigger p={4} cursor="pointer">
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="600">{l1.data.name || `Location ${idx + 1}`}</Text>
                        <Accordion.ItemIndicator>
                          <ChevronDown size={20} />
                        </Accordion.ItemIndicator>
                      </HStack>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <LevelSection
                        level={1}
                        title={l1.data.name || `Location ${idx + 1}`}
                        fields={level1Fields}
                        value={l1.data}
                        onChange={(field, value) => updateLevel1Data(l1.id, field, value)}
                        validationErrors={{
                          name: validationErrors[`l1_${idx}_name`],
                          statusOffert: validationErrors[`l1_${idx}_status`]
                        }}
                      >
                        {l1.level2Sections.map((l2, l2Idx) => (
                          <LevelSection
                            key={l2.id}
                            level={2}
                            title={`Subscription ${l2Idx + 1}`}
                            fields={level2Fields}
                            value={l2.data}
                            onChange={(field, value) => updateLevel2Data(l1.id, l2.id, field, value)}
                            validationErrors={{}}
                          />
                        ))}
                      </LevelSection>
                    </Accordion.ItemContent>
                  </Box>
                </Accordion.Item>
              ))}
                </Accordion.Root>
              </>
            )}

            <Button
              onClick={handleSubmit}
              colorPalette="green"
              size="lg"
              alignSelf="center"
              px={12}
              disabled={submitting}
            >
              {submitting ? <Spinner size="sm" /> : <Save size={18} />}
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </VStack>

      {/* Field Configuration Drawer */}
      <Drawer.Root open={showConfig} onOpenChange={(e) => setShowConfig(e.open)} size="md" placement="end">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <HStack justify="space-between">
                <Heading size="md">Configure Form Fields</Heading>
                <Drawer.CloseTrigger asChild>
                  <IconButton variant="ghost" size="sm">
                    <X size={20} />
                  </IconButton>
                </Drawer.CloseTrigger>
              </HStack>
            </Drawer.Header>
            <Drawer.Body p={6}>
              <VStack align="stretch" gap={6}>
                <FieldConfigurator
                  level={0}
                  availableFields={allAvailableFields}
                  selectedFields={level0Fields}
                  onFieldsChange={setLevel0Fields}
                />
                <Box h="1px" bg="gray.200" />
                <FieldConfigurator
                  level={1}
                  availableFields={allAvailableFields}
                  selectedFields={level1Fields}
                  onFieldsChange={setLevel1Fields}
                />
                <Box h="1px" bg="gray.200" />
                <FieldConfigurator
                  level={2}
                  availableFields={allAvailableFields}
                  selectedFields={level2Fields}
                  onFieldsChange={setLevel2Fields}
                />
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <HStack w="full" gap={2}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLevel0Fields(defaultLevel0Fields);
                    setLevel1Fields(defaultLevel1Fields);
                    setLevel2Fields(defaultLevel2Fields);
                  }}
                  flex={1}
                >
                  Reset to Defaults
                </Button>
                <Button
                  colorPalette="blue"
                  onClick={() => setShowConfig(false)}
                  flex={1}
                >
                  Done
                </Button>
              </HStack>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Box>
  );
};
