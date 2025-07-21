#!/bin/bash
# Script to toggle email verification on/off for VIA Forum

echo "🔧 VIA Forum - Email Verification Toggle"
echo "========================================"

# Check current status
CURRENT=$(fly secrets list | grep EMAIL_DEV_MODE | awk '{print $2}')

if [ -z "$CURRENT" ]; then
    echo "❌ EMAIL_DEV_MODE not found in secrets"
    exit 1
fi

# Get current value
CURRENT_VALUE=$(fly ssh console -C "printenv EMAIL_DEV_MODE" 2>/dev/null | head -1)

echo "Current status: EMAIL_DEV_MODE = $CURRENT_VALUE"
echo ""

if [ "$CURRENT_VALUE" = "true" ]; then
    echo "📧 Email verification is currently: DISABLED (Dev mode ON)"
    echo "New users can register without email confirmation"
    echo ""
    echo "Do you want to ENABLE email verification? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        echo "Enabling email verification..."
        fly secrets set EMAIL_DEV_MODE=false
        echo "✅ Email verification is now ENABLED"
        echo "New users must confirm their email address"
    else
        echo "No changes made"
    fi
else
    echo "📧 Email verification is currently: ENABLED (Dev mode OFF)"
    echo "New users must confirm their email address"
    echo ""
    echo "Do you want to DISABLE email verification? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        echo "Disabling email verification..."
        fly secrets set EMAIL_DEV_MODE=true
        echo "✅ Email verification is now DISABLED"
        echo "New users can register without email confirmation"
    else
        echo "No changes made"
    fi
fi

echo ""
echo "Note: Changes take effect immediately for new registrations"