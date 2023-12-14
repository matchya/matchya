import { Badge } from '../../Badge/Badge';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '../Table';

import { Criterion } from '@/types';

interface ChecklistTableProps {
  checklist: Criterion[];
}

export const ChecklistTable = ({ checklist }: ChecklistTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Keywords</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checklist.map(item => (
          <TableRow key={item.message}>
            <TableCell className="w-[250px] font-medium flex flex-wrap gap-2">
              {['react', 'typescript'].map(keyword => (
                <Badge>{keyword}</Badge>
              ))}
            </TableCell>
            <TableCell>{item.message}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
