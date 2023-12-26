import { Badge } from '../../Badge/Badge';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '../Table';

import { Checklist } from '@/types';

interface ChecklistTableProps {
  checklist: Checklist;
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
        {checklist.criteria.map(item => (
          <TableRow key={item.id}>
            <TableCell className="w-[250px] font-medium flex flex-wrap gap-2">
              {item.keywords.map(keyword => (
                <Badge key={keyword}>{keyword}</Badge>
              ))}
            </TableCell>
            <TableCell>{item.message}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
