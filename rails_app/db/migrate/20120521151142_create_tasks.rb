class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.timestamp :due_at
      t.integer :state, :default => 0

      t.timestamps
    end
  end
end
