-- Create QR code state history table
CREATE TABLE qr_code_state_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  from_state VARCHAR(50),
  to_state VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add index for efficient querying
CREATE INDEX idx_qr_state_changes_qr_id ON qr_code_state_changes(qr_code_id);
CREATE INDEX idx_qr_state_changes_created_at ON qr_code_state_changes(created_at);

-- Add index for QR code status queries
CREATE INDEX idx_qr_codes_status ON qr_codes(status);
