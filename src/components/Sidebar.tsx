import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import tokens from '@contentful/forma-36-tokens';
import { Button, Note } from '@contentful/forma-36-react-components';
import { SidebarExtensionSDK } from 'contentful-ui-extensions-sdk';

import { Parameters } from '../lib/types';
import Row from './Row';
import Select from './Select';

const copy = {
  noWebhooks: "There are no webhook(s) configured in the app's configuration",
  noWebhookUrl:
    "No webhook URL is configured for this webhook in the app's configuration",
  triggerFailed: 'Trigger failed',
  triggerSucceeded: 'Trigger succeeded',
  triggerWebhook: 'Trigger webhook',
};

const Container = styled.div`
  min-height: 180px;
`;

const StyledNote = styled(Note)`
  margin-top: ${tokens.spacingM};
`;

interface SidebarProps {
  sdk: SidebarExtensionSDK;
}

function Sidebar({ sdk }: SidebarProps) {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedWebhook, setSelectedWebhook] = useState<number>(0);
  const { webhooks }: Parameters = sdk.parameters.installation;

  // Make sure the height of the iframe is adjusted to the height of this
  // component dynamically.
  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  if (!webhooks) {
    return (
      <StyledNote noteType="warning" testId="no-webhooks-note">
        {copy.noWebhooks}
      </StyledNote>
    );
  }

  const webhook = webhooks[selectedWebhook];
  const dropdownItems = webhooks.map(({ name }, index) => ({
    label: name || `Webhook ${index + 1}`,
  }));
  const { webhookUrl } = webhook;

  async function handleClick() {
    setError(false);
    setLoading(true);
    setSuccess(false);

    if (!webhookUrl) {
      return;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
    });

    setLoading(false);

    if (!response.ok) {
      setError(true);
      return;
    }

    setSuccess(true);
  }

  return (
    <Container>
      {dropdownItems.length > 1 && (
        <Select
          items={dropdownItems}
          onChange={(index) => setSelectedWebhook(index)}
          testId="webhook-select"
        />
      )}
      <Row>
        <Button
          testId="trigger-webhook-button"
          onClick={handleClick}
          disabled={!webhookUrl || loading}
          loading={loading}
          isFullWidth
        >
          {webhook.buttonText || copy.triggerWebhook}
        </Button>
      </Row>
      {!webhookUrl && (
        <StyledNote noteType="warning" testId="no-webhook-url-note">
          {copy.noWebhookUrl}
        </StyledNote>
      )}
      {success && (
        <StyledNote noteType="positive" testId="success-note">
          {copy.triggerSucceeded}
        </StyledNote>
      )}
      {error && (
        <StyledNote noteType="negative" testId="failure-note">
          {copy.triggerFailed}
        </StyledNote>
      )}
    </Container>
  );
}

export default Sidebar;
