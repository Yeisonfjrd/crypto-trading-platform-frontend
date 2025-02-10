// src/components/settings/ProfileSettings.tsx
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ProfileSettings: React.FC = () => {
  const { user } = useUser();

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input defaultValue={user?.fullName || ""} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input defaultValue={user?.primaryEmailAddress?.emailAddress || ""} disabled />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
