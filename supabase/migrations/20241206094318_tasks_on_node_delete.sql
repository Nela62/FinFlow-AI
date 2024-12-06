ALTER TABLE tasks
  DROP CONSTRAINT tasks_node_id_fkey,
  ADD CONSTRAINT tasks_node_id_fkey FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE SET NULL ON UPDATE CASCADE;

