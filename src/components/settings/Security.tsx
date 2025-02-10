// src/components/settings/Security.tsx
import React from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

const Security: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Security Settings</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">Add an extra layer of security</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-500">Get notified about account activity</p>
          </div>
          <Switch />
        </div>
        <Button variant="destructive">Reset Password</Button>
      </CardContent>
    </Card>
  );
};

export default Security;
