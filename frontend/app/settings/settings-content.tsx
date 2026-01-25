'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pageStyles } from '@/styles';

export function SettingsContent() {
  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Settings</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-6 space-y-6">
        {/* Account Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account information and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Account settings will be available here. This section will include options for
              updating your profile, changing your password, and managing account security.
            </p>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your application preferences and display settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Preference settings will be available here. This section will include options for
              theme selection, language preferences, and other customization options.
            </p>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Notification settings will be available here. This section will include options for
              email notifications, in-app notifications, and notification preferences.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
