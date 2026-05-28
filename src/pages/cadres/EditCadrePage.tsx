import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useCadre, useUpdateCadre } from '@/hooks/useApi';
import { parseNGNToKobo, koboToNaira } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/shared/Skeleton';

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
      name: z.string().min(1, 'Required'),
      amount: z.string().min(1, 'Required'),
      component_type: z.string().min(1, 'Required'),
    })
  ).min(1),
});

type FormData = z.infer<typeof schema>;

export default function EditCadrePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cadreId = parseInt(id || '0');
  const { data: cadre, isLoading } = useCadre(cadreId);
  const updateCadre = useUpdateCadre();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'components' });

  useEffect(() => {
    if (cadre) {
      reset({
        name: cadre.name,
        components: cadre.earning_components.map((c) => ({
          name: c.name,
          amount: koboToNaira(c.amount),
          component_type: c.component_type,
        })),
      });
    }
  }, [cadre, reset]);

  if (isLoading) return <TableSkeleton />;

  function onSubmit(data: FormData) {
    updateCadre.mutate(
      {
        id: cadreId,
        data: {
          name: data.name,
          earning_components: data.components.map((c) => ({
            name: c.name,
            amount: parseNGNToKobo(c.amount),
            component_type: c.component_type as any,
          })),
        },
      },
      { onSuccess: () => navigate('/cadres') }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Salary Grade</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <Card>
          <CardContent>
            <Input label="Grade Name" error={errors.name?.message} {...register('name')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Earning Components</h2>
              <Button type="button" variant="ghost" size="sm" icon={<Plus className="h-4 w-4" />}
                onClick={() => append({ name: '', amount: '', component_type: 'other' })}>
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input placeholder="Name" {...register(`components.${index}.name`)} />
                </div>
                <div className="w-32">
                  <Input placeholder="NGN" {...register(`components.${index}.amount`)} />
                </div>
                <div className="w-32">
                  <Select options={componentTypes} {...register(`components.${index}.component_type`)} />
                </div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="p-2 text-slate-400 hover:text-red-500 cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/cadres')}>Cancel</Button>
          <Button type="submit" loading={updateCadre.isPending} icon={<Save className="h-4 w-4" />}>Save changes</Button>
        </div>
      </form>
    </div>
  );
}
