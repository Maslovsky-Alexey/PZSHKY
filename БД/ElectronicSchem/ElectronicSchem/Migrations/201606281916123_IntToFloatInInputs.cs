namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IntToFloatInInputs : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.InputModels", "X", c => c.Double(nullable: false));
            AlterColumn("dbo.InputModels", "Y", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.InputModels", "Y", c => c.Int(nullable: false));
            AlterColumn("dbo.InputModels", "X", c => c.Int(nullable: false));
        }
    }
}
