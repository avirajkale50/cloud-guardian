import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';

const instanceSchema = z.object({
  instance_id: z.string().min(1, 'Instance ID is required').max(50),
  instance_type: z.string().min(1, 'Instance type is required'),
  region: z.string().min(1, 'Region is required'),
  is_mock: z.boolean().default(true),
});

type InstanceForm = z.infer<typeof instanceSchema>;

const instanceTypes = [
  't2.micro',
  't2.small',
  't2.medium',
  't2.large',
  't3.micro',
  't3.small',
  't3.medium',
  't3.large',
  'm5.large',
  'm5.xlarge',
  'c5.large',
  'c5.xlarge',
];

const regions = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'mock', label: 'Mock (No AWS Required)' },
];

interface AddInstanceDialogProps {
  onAdd: (data: InstanceForm) => Promise<void>;
  isLoading?: boolean;
}

export const AddInstanceDialog: React.FC<AddInstanceDialogProps> = ({
  onAdd,
  isLoading,
}) => {
  const [open, setOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InstanceForm>({
    resolver: zodResolver(instanceSchema),
    defaultValues: {
      is_mock: true,
      region: 'mock',
      instance_type: 't2.micro',
    },
  });

  const isMock = watch('is_mock');

  const onSubmit = async (data: InstanceForm) => {
    await onAdd(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Instance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Register New Instance</DialogTitle>
          <DialogDescription>
            Add an AWS EC2 instance or create a mock instance for testing.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label htmlFor="is_mock" className="text-sm font-medium">
                Mock Instance
              </Label>
              <p className="text-xs text-muted-foreground">
                Test without AWS credentials
              </p>
            </div>
            <Switch
              id="is_mock"
              checked={isMock}
              onCheckedChange={(checked) => {
                setValue('is_mock', checked);
                if (checked) {
                  setValue('region', 'mock');
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instance_id">Instance ID</Label>
            <Input
              id="instance_id"
              placeholder={isMock ? "my-test-instance" : "i-0123456789abcdef0"}
              {...register('instance_id')}
            />
            {errors.instance_id && (
              <p className="text-sm text-destructive">{errors.instance_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instance_type">Instance Type</Label>
            <Select
              value={watch('instance_type')}
              onValueChange={(value) => setValue('instance_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select instance type" />
              </SelectTrigger>
              <SelectContent>
                {instanceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.instance_type && (
              <p className="text-sm text-destructive">{errors.instance_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={watch('region')}
              onValueChange={(value) => setValue('region', value)}
              disabled={isMock}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.region && (
              <p className="text-sm text-destructive">{errors.region.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add Instance'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
