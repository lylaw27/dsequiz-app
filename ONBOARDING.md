# Onboarding Flow

This document describes the onboarding flow implementation for the Quizzo app.

## Overview

The onboarding flow consists of 3 screens that guide new users through the app setup:

1. **Welcome Screen** - Introduction to the app
2. **Subject Selection Screen** - Choose subjects and rank capability
3. **Authentication Screen** - Sign up, login, or continue as guest

## Components

### Screen Components

- `WelcomeOnboardingScreen.tsx` - Welcome screen with app introduction
- `SubjectSelectionOnboardingScreen.tsx` - Subject selection with capability ranking
- `AuthOnboardingScreen.tsx` - Authentication options (login/signup/guest)
- `OnboardingFlow.tsx` - Main container managing the flow between screens
- `onboarding-progress-indicator.tsx` - Shared progress indicator component

### Features

- **Progress Indicator**: Shows current step (dots at the bottom of each screen)
- **Skip Button**: Allows users to skip onboarding (continues as guest)
- **AsyncStorage**: Tracks onboarding completion status
- **Subject Preferences**: Saves user's selected subjects and capability levels
- **Auth Modes**: Supports login, signup, and guest access

## Storage Keys

The onboarding flow uses the following AsyncStorage keys:

- `@quizzo_onboarding_complete` - Boolean indicating if onboarding is complete
- `@quizzo_selected_subjects` - JSON array of selected subjects with capabilities
- `@quizzo_auth_mode` - User's authentication mode ('login' | 'signup' | 'guest')
- `@quizzo_user_email` - User's email (if not guest)

## Usage

The onboarding flow is automatically shown on first launch in `app/(home)/index.tsx`.

### Reset Onboarding (For Development)

To test the onboarding flow again during development:

```typescript
import { resetOnboardingForTesting } from '@/helpers/utils/onboarding-utils';

// Call this function to reset onboarding
await resetOnboardingForTesting();
```

### Get User Preferences

```typescript
import { getSelectedSubjects, getAuthMode } from '@/helpers/utils/onboarding-utils';

const subjects = await getSelectedSubjects();
const authMode = await getAuthMode();
```

## Customization

### Adding New Subjects

Edit the `AVAILABLE_SUBJECTS` array in `SubjectSelectionOnboardingScreen.tsx`:

```typescript
const AVAILABLE_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', icon: '🔢' },
  // Add more subjects here
];
```

### Styling

All screens use Tailwind CSS classes via `uniwind`. Modify the className props to customize appearance.

### Progress Indicator

The progress indicator automatically calculates position based on:
- `totalSteps`: Total number of onboarding screens (3)
- `currentStep`: Current screen index (0-2)

## Navigation Flow

```
Welcome Screen (0)
    ↓ (Next)
Subject Selection (1)
    ↓ (Next with subjects)
Authentication (2)
    ↓ (Complete)
Main App

All screens → (Skip) → Main App (as guest)
```
