import React, { useState } from "react";
import { Bell, Globe, Moon, Sun, Eye, EyeOff, LayoutGrid, Clock, Monitor } from "lucide-react";

import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/theme-provider";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailAlerts: true,
    priceAlerts: true,
    showAccountBalance: false,
    refreshInterval: 60,
    dataDisplayMode: "compact",
    chartAnimation: true,
    language: "en-US",
    timezone: "America/New_York",
  });

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    toast({
      title: "Setting updated",
      description: `Your ${setting} preference has been updated.`,
    });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    
    toast({
      title: "Theme changed",
      description: `Theme has been set to ${newTheme}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 pb-16">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how the application looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleThemeChange("light")}
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleThemeChange("dark")}
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleThemeChange("system")}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        System
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Data Display</Label>
                    <RadioGroup
                      defaultValue={settings.dataDisplayMode}
                      onValueChange={(value) => handleSettingChange("dataDisplayMode", value)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compact" id="compact" />
                        <Label htmlFor="compact" className="font-normal cursor-pointer">Compact</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed" className="font-normal cursor-pointer">Detailed</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="chart-animations">Chart Animations</Label>
                      <Switch
                        id="chart-animations"
                        checked={settings.chartAnimation}
                        onCheckedChange={(checked) => handleSettingChange("chartAnimation", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enable or disable animations in charts and graphs
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Enable Notifications</Label>
                      <Switch
                        id="notifications"
                        checked={settings.notificationsEnabled}
                        onCheckedChange={(checked) => handleSettingChange("notificationsEnabled", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications about market updates and alerts
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <Switch
                        id="email-alerts"
                        checked={settings.emailAlerts}
                        onCheckedChange={(checked) => handleSettingChange("emailAlerts", checked)}
                        disabled={!settings.notificationsEnabled}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts via email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="price-alerts">Price Alerts</Label>
                      <Switch
                        id="price-alerts"
                        checked={settings.priceAlerts}
                        onCheckedChange={(checked) => handleSettingChange("priceAlerts", checked)}
                        disabled={!settings.notificationsEnabled}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get notified when stocks hit your price targets
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Privacy</CardTitle>
                  <CardDescription>
                    Manage your privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-balance">
                        Show Account Balance
                      </Label>
                      <Switch
                        id="show-balance"
                        checked={settings.showAccountBalance}
                        onCheckedChange={(checked) => handleSettingChange("showAccountBalance", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Toggle visibility of your account balance in the dashboard
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Settings</CardTitle>
                  <CardDescription>
                    Configure language and regional preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => handleSettingChange("language", value)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => handleSettingChange("timezone", value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Japan (JST)</SelectItem>
                        <SelectItem value="Asia/Shanghai">China (CST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Data Settings</CardTitle>
                  <CardDescription>
                    Configure how data is loaded and refreshed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="refresh-interval">Auto-refresh interval (seconds)</Label>
                      <span className="text-sm font-medium">
                        {settings.refreshInterval}s
                      </span>
                    </div>
                    <Slider
                      id="refresh-interval"
                      min={15}
                      max={300}
                      step={15}
                      value={[settings.refreshInterval]}
                      onValueChange={(value) => handleSettingChange("refreshInterval", value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>15s</span>
                      <span>60s</span>
                      <span>5m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button>Save All Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
