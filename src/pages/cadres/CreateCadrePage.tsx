import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useCreateCadre } from '@/hooks/useApi';
import { parseNGNToKobo } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

const componentTypes = [
  { value: 'basic', label: 'Basic' },
  { value: 'housing', label: 'Housing' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Other' },
];

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  components: z.array(
    z.object({
      name: z.string().min(1, 'Component name is required'),
      amount: z.string().min(1, 'Amount is required'),
      component_type: z.string().min(1, 'Type is required'),
    })
  ).min(1, 'Add at least one earning component'),
});

type FormData = z.infer<typeof schema>;

export default function CreateCadrePage() {
  const navigate = useNavigate();
  const createCadre = useCreateCadre();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      components: [{ name: 'Basic Salary', amount: '', component_type: 'basic' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'components' });

  function onSubmit(data: FormData) {
    createCadre.mutate(
      {
        name: data.name,
        earning_components: data.components.map((c) => ({
          name: c.name,
          amount: parseNGNToKobo(c.amount),
          component_type: c.component_type as any,
        })),
      },
      { onSuccess: () => navigate('/cadres') }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Salary Grade</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <Card>
          <CardContent>
            <Input
              label="Grade Name"
              placeholder="e.g. Senior Engineer, Manager Level 2"
              error={errors.name?.message}
              {...register('name')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Earning Components</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => append({ name: '', amount: '', component_type: 'other' })}
              >
                Add component
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Component name"
                    error={errors.components?.[index]?.name?.message}
                    {...register(`components.${index}.name`)}
                  />
                </div>
                <div className="w-32">
                  <Input
                    placeholder="Amount (NGN)"
                    error={errors.components?.[index]?.amount?.message}
                    {...register(`components.${index}.amount`)}
                  />
                </div>
                <div className="w-32">
                  <Select
                    options={componentTypes}
                    {...register(`components.${index}.component_type`)}
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-slate-400 hover:text-red-500 mt-0.5 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {errors.components?.message && (
              <p className="text-xs text-red-500">{errors.components.message}</p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/cadres')}>Cancel</Button>
          <Button type="submit" loading={createCadre.isPending} icon={<Save className="h-4 w-4" />}>
            Save grade
          </Button>
        </div>
      </form>
    </div>
  );
}
